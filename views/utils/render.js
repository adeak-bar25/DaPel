import { headHTML, headerHTML, tableRow } from "./layout.js";
import { errorElement } from "./layout.js";

export function renderPage(res, file, page, data, errorMsg ){
    res.render(file, Object.assign({head : headHTML(page), headerHTML},
                                    typeof data !== 'undefined' || data !== null ? data : {},
                                    errorMsg ? {error: errorElement(errorMsg)} : {},
                                ));
} 

