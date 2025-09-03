import * as layout from "./layout.js";
import {createAvatar} from "@dicebear/core";
import { initials } from "@dicebear/collection";

export function renderPage(res, file, page, data, errorMsg ){
    res.render(file, Object.assign({head : layout.headHTML(page), headerHTML : layout.headerHTML},
                                    typeof data !== 'undefined' || data !== null ? data : {},
                                    errorMsg ? {error: layout.errorElement(errorMsg)} : {},
                                    file.includes("dashb")? {aside : layout.dashboardAsideElement(file)} : {}
                                ));
} 

export function renderStudentData(data){
    return data.map((v, i) => layout.tableRow(v, i + 1)).join("")
}

export function renderAvatar(name){
    const avatar =  createAvatar(initials, {
        seed : name
    })
    return avatar.toString()
}

export function renderFormField(fieldsArr){
    return fieldsArr.map(v => layout.fieldElement(v.fieldName, v.isRequired)).join("")
}

// export function