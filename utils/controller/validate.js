import { z, ZodError } from "zod"
import validator from 'validator';
import { is } from "zod/locales";

export function generateVSchema(fields){

    const shape ={}
    fields.forEach(field => {
        let base
        switch(field.type){
            case "string":
                base = z.string(`${field.fieldName} wajib diisi`)
                if(field.minLength){
                    base = base.min(field.minLength, `${field.fieldName} harus minimal ${field.minLength} karakter`)
                }
                break;
            case "email":
                base = z.email(`${field.fieldName} wajib diisi`)
                break;
            case "phone":
                base = z.string(`${field.fieldName} wajib diisi`).refine(val => validator.isMobilePhone( val ,"id-ID"), {
                    error : `${field.fieldName} tidak valid`
                })
                break;
            case "number":
                base = z.number(`${field.fieldName} wajib diisi`)
                break;
            case "date":
                base = z.date(`${field.fieldName} wajib diisi`)
                break;
            case "enum":
                base = z.enum(field.options, `${field.fieldName} wajib diisi`)
                break;
            default:
                base = z.any(`${field.fieldName} wajib diisi`)
        }
        base = field.isRequired? base : base.optional().nullable()
        shape[field.fieldName] = base
    })
    return z.object({
        ...shape
    })
}

export const StudentVSchema = z.object({
    name : z.string().min(3, "Nama harus minimal 3 karakter"),
    nisn : z.coerce.string()
        .min(10, "NISN harus 10 digit")
        .max(10, "NISN harus 10 digit")
        .superRefine(async(val, ctx) => {
            if(!validator.isNumeric(val)){
                ctx.addIssue({
                    code : "custom",
                    message : "NISN harus berupa angka"
                })
            }
            if(await Student.isDuplicate(val)){
                ctx.addIssue({
                    code : "custom",
                    message : "NISN sudah terdaftar"
                })
            }
        }),
    age : z.coerce.number()
        .min(13, "Umur tidak boleh kurang dari 13")
        .max(24, "Umur tidak boleh lebih dari 24"),

    gender : z.enum(["man", "woman"]).refine(v => ["man", "woman"].includes(v), {
        error : "Jenis Kelamin hanya boleh diisi laki-laki atau perempuan"
    }),
    email : z.email("Email wajib diisi"),
    phone : z.string().refine(val => validator.isMobilePhone( val ,"id-ID"), {
        error : "Nomor Telpon tidak valid"
    })
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

export const TokenVSchema = z.coerce.number()
                .min(100000, "Token tidak valid")
                .max(999999, "Token tidak valid")
                .superRefine(async(val, ctx) => {
                    // const b = await InputSession.inputAvailable(val)
                    
                    // if(b === false){
                    //     ctx.addIssue({
                    //         code : "expired",
                    //         message : "Kuota input telah habis, silahkan hubungi admin"
                    //     })
                    // }
                })

export {ZodError}