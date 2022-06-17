export const _handleAddRoomChip = (data, rooms, setRooms) => {
  let rNum = data.roomNum;
  let rNumOfBeds = data.numOfBeds;
  let newKey = 1;
  if (rooms.length != 0) {
    for (let chip of rooms) {
      if (chip.roomNum == rNum)
        return;
    }
    newKey = Math.max.apply(Math, rooms.map(chip => chip.key)) + 1;
  }

  let newObj = {
    "key": newKey,
    "roomNum": parseInt(rNum),
    "numOfBeds": parseInt(rNumOfBeds)
  };
  let newChipData = [...rooms];
  newChipData.push(newObj);

  setRooms(newChipData);
}

export const _getRoomsJson = (rooms) => {
  if (rooms.length === 0) {
    return []
  }
  let retVal = [];
  for (let r of rooms) {
    retVal.push({
      roomNum: r.roomNum,
      numOfBeds: r.numOfBeds,
      deleted: false
    });
  }
  return retVal;
}

export const _setInitialRooms = (data, setRooms) => {
    let rooms = []
    for (let r of data) {
        let newObj = {
            "key": r.id,
            "roomNum": parseInt(r.roomNum),
            "numOfBeds": parseInt(r.numOfBeds)
        };
        rooms.push(newObj);
    }
    setRooms(rooms);
}