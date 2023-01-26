export default (ms = 100) => {
    let timeout;
    let latestCallback: () => void
    return (cb: () => void) => {
        latestCallback = cb
        if (!timeout)
            timeout = setTimeout(() => {
                latestCallback()
                timeout = undefined
            }, ms)
    }
}