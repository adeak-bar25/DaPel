import express from "express";
import { renderPage, renderFormField } from "../../views/utils/render.js";
import { DataModel, SubmissionModel } from "../../utils/data/data.js";
import { TokenStatInfo } from "../../utils/data/model/dataModel.js";
// import { StudentVSchema } from '../../utils/controller/validate.js';
// import { validateAndGetTokenCookie } from '../../utils/controller/auth.js'

const router = express.Router();

router.get("/", (req, res) => {
    res.status(301).redirect("/user/login");
});

router.get("/login", (req, res) => {
    function showPage(msg) {
        return renderPage(res, "userlogin", "Masukkan Token", null, msg ? msg : null);
    }

    switch (req.query.e) {
        case "inval":
            return showPage("Token tidak valid, token harus berupa angka 6 digit!");
        case "wrong":
            return showPage("Token Salah, silahkan cek kembali!");
        case "expired":
            return showPage("Token Expired/Limit, silahkan hubungi admin!");
        case "full":
            return showPage("Token sudah penuh, silahkan hubungi admin!");
        case "intrna":
            return showPage("Server gagal mengecek token, silahkan coba lagi!");
        case "empty":
            return showPage("Token tidak boleh kosong");
        default:
            return showPage();
    }
});

router.post("/login", (req, res) => {
    res.redirect(`/user/input?token=${req.body.token}`);
});

router.use("/input", async (req, res, next) => {
    function redirectBadReq(errCode) {
        // console.log("it's bad req", errCode)
        return res.status(400).redirect(`/user/login?e=${errCode}`);
    }
    if (req.query.token === null) return redirectBadReq("empty");
    const tokeninfo = await DataModel.isTokenUsable(req.query.token);
    if (!tokeninfo.ok) {
        switch (tokeninfo.error[0]) {
            case TokenStatInfo.INVALID:
                return redirectBadReq("inval");
            case TokenStatInfo.NOTFOUND:
                return redirectBadReq("wrong");
            case TokenStatInfo.EXPIRED:
                return redirectBadReq("expired");
            case TokenStatInfo.FULL:
                return redirectBadReq("full");
            default:
                return redirectBadReq("intrna");
        }
    }
    next();
});

router.get("/input", async (req, res, next) => {
    const tokenInfo = await DataModel.getDataInfoByToken(req.query.token);

    renderPage(res, "userinput", "Masukkan Data Anda", { fields: renderFormField(tokenInfo.fields) });
});

router.post("/input", async (req, res, next) => {
    try {
        SubmissionModel.insertSubmission(req.query.token, req.body);
        res.redirect("/user/thanks");
    } catch (error) {
        next(error);
    }
});

router.get("/thanks", async (req, res) => {
    try {
        renderPage(res, "thanks", "Terima Kasih");
    } catch (error) {
        throw error;
    }
});

export default router;
