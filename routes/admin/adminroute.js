import express from "express";
import { renderPage, renderStudentData, getAllStudentData } from "./../route.js";
import { renderTable } from "../../views/utils/render.js";
import { createNewAdminAccount, createNewAdminSession, generateInputToken, cookieLogin, changePassword } from "../../utils/controller/auth.js";
import { AdminSessionModel, Admin, DataModel } from "../../utils/data/data.js";
import { infoSymAdmin } from "../../utils/data/model/adminmodel.js";
import * as changeCase from "change-case";
import { ZodError, StudentVSchema, InputSessionVSchema } from "./../../utils/controller/validate.js";
import { SubmissionModel } from "../../utils/data/model/submissionModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
    res.status(301);
    res.redirect("/admin/login");
});

router.get("/login", async (req, res) => {
    let errMsg;
    switch (req.query.e) {
        case "empty":
            errMsg = "Field login tidak boleh kosong";
            break;
        case "notfound":
            errMsg = "Admin tidak ditemukan";
            break;
        case "wrong":
            errMsg = "Password salah";
            break;
        case "interna":
            errMsg = "Terjadi Kesalahan Pada Server";
            break;
        default:
            errMsg = null;
    }
    renderPage(res, "adminlogin", "Login Sebagai Admin", null, errMsg);
});

router.get("/signin", async (req, res) => {
    renderPage(res, "newadmin", "Daftar Admin", null, req.query.e === "duplicate" ? "Username Yang Anda Masukkan Sudah Terdaftar" : null);
});

router.post("/login", async (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) return res.status(400).redirect("/admin/login?e=empty");
    try {
        const validID = await Admin.validateLogin({ name, password });
        switch (validID) {
            case infoSymAdmin.notFound:
                return res.status(404).redirect("/admin/login?e=notfound");
            case infoSymAdmin.wrong:
                return res.status(401).redirect("/admin/login?e=wrong");
        }
        await createNewAdminSession(validID, res);
        res.redirect("/admin/dashboard");
    } catch (err) {
        res.status(500).redirect("/admin/login?e=interna");
        throw err;
    }
});

router.post("/signin", async (req, res) => {
    const info = await Admin.createNewAdmin(req.body.username, req.body.password);
    if (info === infoSymAdmin.duplicate) return res.status(409).redirect("/admin/signin?e=duplicate");
    const a = await createNewAdminSession(info._id, res);

    res.status(303).redirect("/admin/dashboard");
});

router.use("/dashboard/", async (req, res, next) => {
    const uuid = req.cookies.loginDapelSes;
    if (!uuid) return res.status(401).redirect("/admin/login");

    const session = await cookieLogin(uuid);
    if (!session.isValid) return res.status(401).redirect("/admin/login");
    if (!req.cookies.tempSession) session.setSessionCookie(res).increaseCookieTime(res);
    next();
});

router.get("/dashboard", async (req, res, next) => {
    try {
        const estimatedSub = await DataModel.getEstimatedNumberBySessionID(req.cookies.loginDapelSes);
        renderPage(res, "dashboardhome", "Dashboard Admin", { estimatedSub });
    } catch (error) {
        next(error);
    }
});

router.get("/dashboard/data", async (req, res, next) => {
    try {
        const data = await DataModel.getAllDataBySessionUUID(req.cookies.loginDapelSes);
        // let dataList = await DataModel.getAllFormNameBySessionUUID(req.cookies.loginDapelSes);
        let tables;
        if (Array.isArray(data)) {
            const submissionsPromise = data.map(async (e, i) => {
                const fields = e.fields;
                const listSubmission = await SubmissionModel.getAllSubmissionByToken(e.tokenInfo.token);
                return Object.assign({ formName: e.formName }, { listSubmission, fields });
            });
            const submissions = await Promise.all(submissionsPromise);
            tables = submissions.map((e) => renderTable(e));
        }

        // if (!dataList === 0) {
        //     dataList = dataList.map((e) => {
        //         return {
        //             ...e,
        //             nameCamel: changeCase.camelCase(e)
        //         };
        //     });
        // }
        // renderPage(res, "dashboarddata", "Data - Dashboard Admin", {
        //     submissions: Object.values(submissions.length !== 0 ? submissions : {}),
        //     ...(fields ? { tableHeader: renderTableHeader(fields) } : { msg: "Belum Ada Data" })
        // });

        // const tablesElm = await submissions.map(s => )

        renderPage(res, "dashboarddata", "Data - Dashboard Admin", {
            tables: tables
        });
    } catch (error) {
        next(error);
    }
});

router.get("/dashboard/options", (req, res) => {
    renderPage(res, "dashboardoption", "Option - Dashboard Admin");
});

router.get("/dashboard/control", async (req, res) => {
    const tokens = await DataModel.getAllTokenInfoByOwnerID(req.cookies.loginDapelSes);
    // console.log(tokens);
    renderPage(res, "dashboardcontrol", "Control - Dashboard Admin", { tokens });
});

router.post("/dashboard/api/newinputsec", async (req, res, next) => {
    // console.log(req.body);
    if (!req.body.formName || !req.body.maxInput) return req.status(400).json({ ok: false, msg: "Form Name dan Max Input harus diisi" });
    try {
        // const data = await DataModel.create({
        //     ownerID: await AdminSessionModel.getAdminID(req.cookies.loginDapelSes),
        //     formName: req.body.formName,
        //     fields: req.body.fields
        // });
        // console.log(dataID.toString())
        // const { token } = await TokenModel.generateToken({
        //   dataID : dataID.toString(),
        //   maxInput : parseInt(req.body.maxInput),
        //   expireAt : req.body.expireAt
        // })

        const data = await DataModel.newData(await AdminSessionModel.getAdminID(req.cookies.loginDapelSes), req.body.formName, req.body.fields, parseInt(req.body.maxInput), req.body.expireAt);
        res.json({
            ok: true,
            msg: "Berhasil membuat token",
            token: data.tokenInfo.token
        });
    } catch (error) {
        next(error);
    }
});

router.delete("/dashboard/api/delete/student", async (req, res, next) => {
    if (!req.body.id) {
        return res.status(400).json({ ok: false, msg: "ID tidak boleh kosong!" });
    }
    try {
        await Student.deleteStudent(req.body.id);
        res.json({ ok: true, msg: "Data siswa berhasil dihapus!" });
    } catch (err) {
        next(err);
    }
});

router.put("/dashboard/api/update/password", async (req, res, next) => {
    const { ["loginDapelSes"]: sessionUUID, oldPassword, newPassword } = Object.assign(req.cookies, req.body);
    // console.log(oldPassword, newPassword, sessionUUID);
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ ok: false, msg: "Password lama dan baru harus diisi!" });
    }
    try {
        await changePassword(sessionUUID, oldPassword, newPassword);
        return res.json({ ok: true, msg: "Password berhasil diubah!" });
    } catch (error) {
        if (error.message === "Password lama salah") return res.status(400).json({ ok: false, msg: error.message });
        next(error);
    }
});

export default router;
