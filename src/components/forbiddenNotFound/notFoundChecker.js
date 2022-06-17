
export function propsLocationStateFound(props, history) {
    if (props.location.state === undefined || props.location.state === null) {
        history.push("/notFoundPage");
        return false;
    }
    return true;
}