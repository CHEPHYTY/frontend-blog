let month = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]

let day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export let getDay = (timestamp) => {
    let date = new Date(timestamp)

    return `${date.getDate()} ${month[date.getMonth()]}`
}
