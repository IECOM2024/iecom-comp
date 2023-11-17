import moment from "moment"

export const calculateDuration = (dueDate: Date) => {
    const now = moment()
    const duration = moment.duration(moment(dueDate).diff(now))
    const durationRemaining = duration.asMilliseconds()
    return durationRemaining
}

export const calculateDueDateFromNow = (duration: number) => {
    const now = moment()
    const dueDate = now.add(duration, "ms")
    console.log(dueDate.toDate().toLocaleDateString())
    console.log(now.toDate())
    console.log(duration)
    return dueDate.toDate()
}
export const calculateDueDate = (duration: number, startDate: Date) => {
    const dueDate = moment(startDate).add(duration, "ms")
    return dueDate.toDate()
}