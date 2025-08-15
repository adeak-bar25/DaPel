import { z, ZodError } from "zod"
import validator from 'validator';

export const StudentVSchema = z.object({
    name : z.string().min(3, "Nama harus minimal 3 karakter"),
    grade : z.coerce.number()
        .min(10, "Kelas tidak boleh kurang dari 10")
        .max(12, "Kelas tidak boleh lebih dari 12"),
    class : z.string({
        required_error: "Nama wajib diisi",
    }).min(1, "Nama wajib diisi"),
    age : z.coerce.number()
        .min(13, "Umur tidak boleh kurang dari 13")
        .max(24, "Umur tidak boleh lebih dari 24"),
    phone : z.string().refine(val => validator.isMobilePhone( val ,"id-ID"), {
        error : "Nomor Telpon tidak valid"
    }),
    gender : z.enum(["man", "woman"]).refine(v => ["man", "woman"].includes(v), {
        error : "Jenis Kelamin hanya boleh diisi laki-laki atau perempuan"
    }),
    email : z.email("Email wajib diisi")
})

export const InputSessionVSchema = z.object({
    grade : z.coerce.number()
        .min(10, "Kelas tidak boleh kurang dari 10")
        .max(12, "Kelas tidak boleh lebih dari 12"),
    className : z.string("Nama wajib diisi")
        .min(1, "Nama wajib diisi"),
    token : z.coerce.number()
        .refine(val => val.toString().length === 6, {
            error : "Server gagal mengenerate token, Silahkan Coba lagi"
        }),
    maxInput : z.coerce.number().min(1, "Max Input harus diisi"),
    expireAt: z.iso.datetime("Tanggal tidak benar")
                .optional()
                .nullable()
                .transform(v => v ? new Date(v) : null)
})

export const TokenVSchema = z.coerce.number().min(100000, "Token tidak valid").max(999999, "Token tidak valid")

export {ZodError}