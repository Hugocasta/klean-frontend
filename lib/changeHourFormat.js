/* Fonction qui permet un affichage classique de l'heure */
const changeHourFormat = oldHour => {
    
    let hour = new Date (oldHour);
        
        let clearHour = hour.getHours();
        let clearMin = hour.getMinutes();

        return `${clearHour < 10 ? '0'+clearHour : clearHour} : ${clearMin < 10 ? '0'+clearMin : clearMin}`

}

export default changeHourFormat;