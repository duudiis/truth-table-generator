const truth = {
    symbols: {
        negation: ["~", "!", "¬"],
        operators: {
            "and": ["&&", "&", "∧"],
            "or": ["||", "|", "∨"],
            "implication": ["->", "=>", ">", "→", "⇒"],
            "biconditional": ["<->", "<=>", "<>", "↔", "=", "≡"],
            "exclusive": ["&|", "|&", "⊕"],
            "nand": ["^", "↑"],
            "nor": ["v", "↓"]
        }
    },
    table: {
        "and": (v1, v2) => v1 == "V" && v2 == "V" ? "V" : "F",
        "or": (v1, v2) => v1 == "F" && v2 == "F" ? "F" : "V",
        "implication": (v1, v2) => v1 == "V" && v2 == "F" ? "F" : "V",
        "biconditional": (v1, v2) => v1 == v2 ? "V" : "F",
        "exclusive": (v1, v2) => v1 == v2 ? "F" : "V",
        "nand": (v1, v2) => v1 == "V" && v2 == "V" ? "F" : "V",
        "nor": (v1, v2) => v1 == "F" && v2 == "F" ? "V" : "F"
    }
}

const settings = {
    sortVariables: false,
    invertVariables: false
}

// Switches sortVariables and invertVariables on checkbox click

sort.addEventListener("click", () => {
    settings.sortVariables = !settings.sortVariables;
    updateTable(expression.value);
})

invert.addEventListener("click", () => {
    settings.invertVariables = !settings.invertVariables;
    updateTable(expression.value);
})

// Runs on input update

expression.addEventListener("input", function (e) {
    updateTable(this.value);
});

function updateTable(expression) {

    // Gets result table
    const table = document.getElementById("table");

    table.innerHTML = "";

    if (!expression) { return; }

    // Solves expression
    const { variables, result } = solveExpression(expression);

    // Creates row for each variable and expression

    let titleRow = table.insertRow();

    for (let [key, value] of variables.entries()) {
        if (parseInt(key) != key) {
            let cell = titleRow.insertCell();
            cell.innerHTML = key;
        }
    }

    let cell = titleRow.insertCell();
    cell.innerHTML = expression;

    // Creates row for each value

    for (let i = 0; i < result.length; i++) {

        let row = table.insertRow();

        for (let [key, value] of variables.entries()) {
            if (parseInt(key) != key) {
                let cell = row.insertCell();
                cell.innerHTML = value[i];
            }
        }

        let cell = row.insertCell();
        cell.innerHTML = result[i];

    }

}

function solveExpression(expression) {

    // Refine expression

    expression = expression.toLowerCase().trim().replace(/ +/g, " ");

    for (let symbol of truth.symbols.negation) {
        expression = expression.replaceAll(`${symbol} `, `${symbol}`);
    }

    // Parse variables in expression

    const variables = parseVariables(expression);

    // For each parenthesis in expression

    for (let i = 0; i == i; i++) {

        // Get and refine parenthesis expression (or final expression)

        const exec = /\([^()]+\)/g.exec(expression);

        let pExpression = exec?.[0]?.slice(1, -1)?.split(" ")?.filter(n => n != "") ?? expression.split(" ");

        // Check if the parenthesis has only one variable (and if so, return that value only)

        if (exec?.[0] && pExpression.length == 1) {

            variables.set((i + 1).toString(), getVariable(variables, pExpression[0]));
            expression = expression.replaceAll(exec?.[0], (i + 1).toString());
            continue;

        } else if (exec == null && pExpression.length == 1) { break; } // If there is no parenthesis and there is one value, that's the final result, break

        // Solve each operation inside parenthesis expression

        let finalResult;
        for (let i = 0; i < pExpression.length; i++) {

            if ((i % 2) == 1) {

                const operationResult = getResult(variables, pExpression[i - 1], pExpression[i], pExpression[i + 1]);
                pExpression[i + 1] = operationResult;

                finalResult = operationResult;

            }

        }

        // Creates temporary variable to replace parenthesis expression

        variables.set((i + 1).toString(), finalResult);
        expression = expression.replaceAll(exec?.[0] ?? expression, (i + 1).toString());

        // If there are no more parenthesis, break the loop

        if (exec == null) { break; }

    }

    // Return the result

    return { variables, result: getVariable(variables, expression.split(" ")[0]) };

}

function parseVariables(expression) {

    // Get the letters

    let letters = new Set();

    for (const char of expression) {
        if (char.match(/[a-z]/g) && char != "v") { letters.add(char); }
    }

    if (settings.sortVariables) {
        letters = new Set(Array.from(letters).sort()); // sorts the variables (optional)
    }

    // Assign variables

    const variables = new Map();

    let lettersCount = 0;
    let lettersAmount = 2 ** letters.size;

    for (const letter of letters.values()) {
        lettersCount++;
        lettersAmount = lettersAmount / 2;

        let letterValue = [];

        for (let i = 0; i < (2 ** (lettersCount - 1)); i++) {
            for (let i = 0; i < lettersAmount; i++) { letterValue.push(settings.invertVariables ? "F" : "V"); }
            for (let i = 0; i < lettersAmount; i++) { letterValue.push(settings.invertVariables ? "V" : "F"); }
        }

        variables.set(letter, letterValue);

    }

    return variables;

}

function getVariable(variables, variable) {

    // Checks if variable is negated

    let invertVariable = false;
    for (let char of variable) {
        if (truth.symbols.negation.includes(char)) { invertVariable = !invertVariable; variable = variable.replace(char, ""); }
    }

    // If the variable is negated, return the inverted value, else return the value

    if (invertVariable) {

        let variableValue = variables.get(variable);

        let newvariable = [];

        for (let value of variableValue) {
            newvariable.push(value == "V" ? "F" : "V");
        }

        return newvariable;

    } else {

        return variables.get(variable);

    }

}

function getResult(variables, v1, operator, v2) {

    // Get variables value

    let from = Array.isArray(v1) ? v1 : getVariable(variables, v1);
    let to = Array.isArray(v2) ? v2 : getVariable(variables, v2);

    // Get operator name

    for (let [key, values] of Object.entries(truth.symbols.operators)) {
        for (let value of values) {
            if (value == operator) { operator = key; }
        }
    }

    // Solve the operation

    let resultValue = [];

    for (let i = 0; i < from.length; i++) {

        resultValue.push(truth.table[operator](from[i], to[i]));

    }

    return resultValue;

}