export function toPossessivePronoun(name) {
    return name.toUpperCase() === "YOU" ? "Your"
        : name.charAt(name.length - 1).toUpperCase() === 'S' ? `${name}'`
        : `${name}'s`
}