export function toPossessivePronoun(name) {
    return name.toUpperCase() === "YOU" ? "Your"
        : name.charAt(name.length - 1).toUpperCase() === 'S' ? `${name}'`
        : `${name}'s`
}

export function toProperCase(text) {
    return text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();
}