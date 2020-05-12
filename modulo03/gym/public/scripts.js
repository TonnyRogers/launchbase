const currentPage = location.pathname
const menuItems = document.querySelectorAll('header .links a')

for( item of menuItems){
    item.classList.remove("active")
    
    if(currentPage.includes(item.getAttribute('href'))){
        item.classList.add('active')
    }
}

console.log(menuItems[0].getAttribute('href'))