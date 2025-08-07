export function headHTML(pageTitle){
    return `<meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${pageTitle} | DaPel</title>
            <link rel="stylesheet" href="/css/style.css">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=TikTok+Sans:opsz,wght@12..36,300..900&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=info,visibility,visibility_off" />
            <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
            <script src="/js/script.js" defer></script>`
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
    return `<div class="md:[80%] mt-4 bg-rose-200 border border-red-500 flex flex-row gap-3 items-center p-3 rounded-md mt-2 mb-4 max-md:mt-3 max-md:mb-2">
                <span class="material-symbols-outlined text-red-600">info</span>
                <span>Terjadi Error: ${message}</span>
            </div>`
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