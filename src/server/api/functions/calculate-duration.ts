import moment from "moment"

export const calculateDuration = (dueDate: Date) => {
    const now = moment()
    const duration = moment.duration(moment(dueDate).diff(now))
    const durationRemaining = duration.asMilliseconds()
    return durationRemaining
}

export const calculateDueDate = (duration: number) => {
    const now = moment()
    const dueDate = now.add(duration, "ms")
    return dueDate.toDate()
}