export const _handleAddRuleChip = (data, rulesOfConduct, setRulesOfConduct, checked) => {
    let rName = data.ruleName;
    let newKey = 1;
    if (rulesOfConduct.length != 0) {
        for (let chip of rulesOfConduct) {
            console.log("baaaaaaaaaaa");
            console.log(chip);
            console.log(rName);
            if (chip.ruleName.toLowerCase() === rName.toLowerCase())
                return;
        }
        newKey = Math.max.apply(Math, rulesOfConduct.map(chip => chip.key)) + 1;
    }
    let isAllowed = checked;

    let newObj = {
        "key": newKey,
        "ruleName": rName,
        "allowed": isAllowed
    };
    let newChipData = [...rulesOfConduct];
    newChipData.push(newObj);
    setRulesOfConduct(newChipData);
}

export const _setInitialRulesOfConduct = (data, setRulesOfConduct) => {
    let ruleData = []
    for (let rule of data) {
        let newObj = {
            "key": rule.id,
            "ruleName": rule.ruleName,
            "allowed": rule.allowed
        };
        ruleData.push(newObj);
    }
    setRulesOfConduct(ruleData);
}

export const _getRuleNamesJson = (rulesOfConduct) => {
    if (rulesOfConduct.length === 0) {
        return []
    }
    let retVal = [];
    for (let r of rulesOfConduct) {
        retVal.push({
            ruleName: r.ruleName,
            allowed: r.allowed,
        });
    }
    return retVal;
}
