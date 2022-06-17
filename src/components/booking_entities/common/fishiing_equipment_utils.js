export const _handleAddFishingEquipmentChip = (data, fishingEquipment, setFishingEquipment) => {
    let eName = data.equipmentName
    let newKey = 1;
    if (fishingEquipment.length != 0) {
        for (let chip of fishingEquipment) {
            if (chip.equipmentName.toLowerCase() === eName.toLowerCase())
                return;
        }
        newKey = Math.max.apply(Math, fishingEquipment.map(chip => chip.key)) + 1;
    }
    let newObj = {
        "key": newKey,
        "equipmentName": eName,
    };
    let newChipData = [...fishingEquipment];
    newChipData.push(newObj);

    setFishingEquipment(newChipData);
}

export const _setInitialFishingEquipment = (data, setFishingEquipment) => {
    let equipmentData = []
    for (let eq of data) {
        let newObj = {
            "key": eq.id,
            "equipmentName": eq.equipmentName,
        };
        equipmentData.push(newObj);
    }
    setFishingEquipment(equipmentData);
}

export const _getFishingEquipmentNamesJson = (fishingEquipment) => {
    if (fishingEquipment.length === 0) {
        return []
    }
    let retVal = [];
    for (let equipment of fishingEquipment) {
        retVal.push({
            equipmentName: equipment.equipmentName,
        });
    }
    return retVal;
}

