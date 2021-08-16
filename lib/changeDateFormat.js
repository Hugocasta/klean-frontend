/* Fonction qui permet de modifier l'affichage des dates d'un format Javascript à un format classique */

const changeDateFormat = oldDate => {
    
    let date = new Date (oldDate);
        
        let clearDay = date.getDate();
        let clearMonth = date.getMonth()+1;
        let clearFullYear = date.getFullYear();


        return `${clearDay < 10 ? '0'+clearDay : clearDay} / ${clearMonth < 10 ? '0'+clearMonth : clearMonth} / ${clearFullYear} `

}

export default changeDateFormat;




