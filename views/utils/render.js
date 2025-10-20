import * as layout from "./layout.js";
import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";

export function renderPage(res, file, page, data, errorMsg) {
    res.render(file, Object.assign({ head: layout.headHTML(page), headerHTML: layout.headerHTML }, typeof data !== "undefined" || data !== null ? data : {}, errorMsg ? { error: layout.errorElement(errorMsg) } : {}, file.includes("dashb") ? { aside: layout.dashboardAsideElement(file) } : {}));
}

export function renderStudentData(data) {
    return data.map((v, i) => layout.tableRow(v, i + 1)).join("");
}

export function renderAvatar(name) {
    const avatar = createAvatar(initials, {
        seed: name
    });
    return avatar.toString();
}

export function renderFormField(fieldsArr) {
    return fieldsArr.map((v) => layout.fieldElement(v.fieldName)).join("");
}

export function renderTableHeader(fieldArr) {
    return `<thead>
                <tr>
                    <th class="w-[1%] whitespace-nowrap">No</th>
                    ${fieldArr.map((e) => layout.tableHeader(e.fieldName)).join("")}
                </tr>
            </thead>`;
}

const originalLog = console.log;
console.log = function (...args) {
    const stack = new Error().stack.split("\n")[2].trim();
    originalLog(`[${stack}]`, ...args);
};

export function renderTable(data) {
    const tableHeader = renderTableHeader(data.fields);
    const tableBody = data.listSubmission
        .map((submission, i) => {
            console.log(submission);
            const field = data.fields.map((e) => {
                const tdElm = (td, isEmpty) => `<td ${isEmpty ? 'class="text-gray-500"' : 'class="font-medium"'}>${td}</td>`;
                const currFld = submission[e.fieldName.toLowerCase()];
                return currFld === undefined || currFld === null || currFld.length <= 0 ? tdElm("(kosong)", true) : tdElm(currFld);
            });

            return `
            <tr>
                <td>${i + 1}</td>
                ${field.join("")}
            </tr>
        `;
        })
        .join("");
    console.log("itersuc");
    return `
        <h2>Table Data : ${data.formName}</h2>
        <table class="w-full border-collapse border border-slate-400 text-left text-lg [&_td]:p-2 [&_td]:text-sm [&_th]:bg-slate-300 [&_th]:p-2 [&_th,td]:border-1 [&_th,td]:border-slate-400 [&_th:first-child,td:first-child]:text-center [&_tr:nth-child(even)]:bg-white [&_tr:nth-child(odd)]:bg-slate-100">
            ${tableHeader}
            <tbody class="[&_td]:text-lg">
                ${tableBody}
            </tbody>
        </table>
    `;
}
