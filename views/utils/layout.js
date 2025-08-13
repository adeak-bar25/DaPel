export function headHTML(pageTitle){
    return `<meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${pageTitle} | DaPel</title>
            <link rel="stylesheet" href="/css/style.css">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=TikTok+Sans:opsz,wght@12..36,300..900&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=app_registration,arrow_forward_ios,check,close,content_copy,error,home,info,settings,view_list,visibility,visibility_off" />
            <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
            <script src="/js/script.js" type="module" defer></script>`
}

export const headerHTML = `<header class="flex justify-between bg-primary/95 backdrop-blur-3xl p-3 fixed top-0 z-50 right-0 left-0 px-3">
                            <div class="brand flex items-center text-2xl font-bold text-slate-50">Da<span class="text-secondary">Pel</span></div>
                            <nav class="flex items-center gap-4">
                                <a href="/admin" class="text-slate-50 max-md:hidden">Login Sebagai Admin</a>
                                <div class="sep-y border-slate-50"></div>
                                <a href="/user" class="btn-outline border-gray-50/80 text-slate-50">Masukkan Data</a>
                            </nav>
                        </header>`

export function errorElement(message) {
    return `<div class="md:[80%] mt-4 bg-rose-200 border border-red-500 flex flex-row gap-3 items-center p-3 rounded-md mb-4 max-md:mt-3 max-md:mb-2">
                <span class="material-symbols-rounded text-red-600">info</span>
                <span>Terjadi Error: ${message}</span>
            </div>`
}

export function dashboardAsideElement(file){
    return `<aside class="fixed left-0 bottom-0 flex flex-col gap-1.5 [&>*]:text-center [&_a]:leading-0 [&_a]:block [&_div]:rounded-md [&_div]:p-1 [&>*]:hover:bg-slate-300/30 [&>*]:cursor-pointer px-1 py-3 bg-white border-r border-slate-400/40 select-none">
                <a href="/admin/dashboard"><div class="material-symbols-rounded ${file.includes('home')? "bg-primary/20" : ""}">home</div></a>
                <a href="/admin/dashboard/data"><div class="material-symbols-rounded ${file.includes('data')? "bg-primary/20" : ""}">view_list</div></a>
                <a href="/admin/dashboard/control"><div class="material-symbols-rounded ${file.includes('control')? "bg-primary/20" : ""}">app_registration</div></a>
                <a href="/admin/dashboard/options"><div class="material-symbols-rounded ${file.includes('option')? "bg-primary/20" : ""}">settings</div></a>
            </aside>`
}

export function tableRow(studentObj, index) { 
    return `<tr>
                <td>${index}</td>
                <td>${[studentObj.grade, studentObj.class].join(' ')}</td>
                <td>${studentObj.nisn}</td>
                <td>${studentObj.name}</td>
                <td>${studentObj.age}</td>
                <td>${studentObj.email}</td>
                <td>${studentObj.phone}</td>
            </tr>`
}