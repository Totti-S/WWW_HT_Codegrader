/*
*  General funnction to format the date object to readable format readable
*  Takes in "Date" type or string that is convertable to "Date" type 
*/

const convertDate = function (time) {
    if(typeof(time) === 'string') time = new Date(time);

    let year =  time.getFullYear() -2000;
    let month = time.getMonth();
    if (month < 10) month = "0"+month;
    
    let day = time.getDate();
    if (day < 10) day = "0"+day;
    let hour = time.getHours();
    if (hour < 10) hour = "0" +hour 
    let minute = time.getMinutes();
    if (minute < 10) minute = "0" +minute 

    return(
        `${hour}:${minute} ${day}/${month}/${year}`
    );
}


export default convertDate;