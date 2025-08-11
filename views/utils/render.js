import { headHTML, headerHTML, tableRow, dashboardAsideElement, errorElement } from "./layout.js";
import {createAvatar} from "@dicebear/core";
import { initials } from "@dicebear/collection";

export function renderPage(res, file, page, data, errorMsg ){
    res.render(file, Object.assign({head : headHTML(page), headerHTML},
                                    typeof data !== 'undefined' || data !== null ? data : {},
                                    errorMsg ? {error: errorElement(errorMsg)} : {},
                                    file.includes("dashb")? {aside : dashboardAsideElement(file)} : {}
                                ));
} 

export function renderStudentData(data){
    return data.map((v, i) => tableRow(v, i + 1)).join("")
}

export function renderAvatar(name){
    const avatar =  createAvatar(initials, {
        seed : name
    })
    return avatar.toString()
}