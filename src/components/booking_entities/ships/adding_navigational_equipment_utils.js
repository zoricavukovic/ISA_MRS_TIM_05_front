
export const _handleAddNavigationalEquipmentChip = (data, navigationalEquipment, setNavigationalEquipment) => {
  let eName = data.equipmentName
  let newKey = 1;
  if (navigationalEquipment.length != 0) {
    for (let chip of navigationalEquipment) {
      if (chip.name.toLowerCase() === eName.toLowerCase())
        return;
    }
    newKey = Math.max.apply(Math, navigationalEquipment.map(chip => chip.key)) + 1;
  }
  let newObj = {
    "key": newKey,
    "name": eName,
  };
  let newChipData = [...navigationalEquipment];
  newChipData.push(newObj);
  setNavigationalEquipment(newChipData);
}

export const _getNavigationalEquipmentNamesJson = (navigationalEquipment) => {
  if (navigationalEquipment.length === 0) {
    return []
  }
  let retVal = [];
  for (let equipment of navigationalEquipment) {
    retVal.push({
      name: equipment.name,
    });
  }
  return retVal;
}


export const _setInitialNavigationalEquipment = (data, setNavigationalEquipment) => {
    let navigationalEquipment = []
    for (let r of data) {
        let newObj = {
            "key": r.id,
            "name": r.name
        };
        navigationalEquipment.push(newObj);
    }
    setNavigationalEquipment(navigationalEquipment);
}