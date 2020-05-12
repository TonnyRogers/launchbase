const currentPage = location.pathname
const menuItems = document.querySelectorAll('header .links a')

for( item of menuItems){
    item.classList.remove("active")
    
    if(currentPage.includes(item.getAttribute('href'))){
        item.classList.add('active')
    }
}

// Paginacao

function paginate(selectedPage, totalPages) {
    let firstPage = 1,
    pages = [],
    oldPage

    for(let currentPage = 1; currentPage <= totalPages; currentPage++){
        
        const firstAndLastPage = currentPage == 1 || currentPage == totalPages
        const pagesAfterSelectedPage = currentPage <= selectedPage + 2
        const pagesBeforeSelectedPage = currentPage >= selectedPage - 2
        const pagesDotsAfterSelectedPage = currentPage == selectedPage + 3 && currentPage != totalPages
        const pagesDotsBeforeSelectedPage = currentPage == selectedPage - 3 && currentPage != firstPage

        if(firstAndLastPage || pagesAfterSelectedPage && pagesBeforeSelectedPage){
            // if(oldPage && currentPage - oldPage > 2){
            //     pages.push('...')
            // }

            // if(oldPage && currentPage - oldPage == 2){
            //     pages.push(oldPage + 1)
            // }

            pages.push(currentPage)

            // oldPage = currentPage
        }
        
        if( pagesDotsAfterSelectedPage || pagesDotsBeforeSelectedPage){
            const dots = '...'
            pages.push('...')
        }
    }

    return pages
}

function createPagination(paginationElement) {
    const page = +paginationElement.dataset.page
    const total = +paginationElement.dataset.total
    const filter = paginationElement.dataset.filter || ''
    const pages = paginate(page,total)

    let elements = ''

    for (const page of pages) {
        if(String(page).includes('...')){
            elements += `<span>${page}</span>`
        }else{
            elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
        }
    }

    return paginationElement.innerHTML = elements
}

const paginationElement = document.querySelector('.pagination')

if(paginationElement) createPagination(paginationElement);
