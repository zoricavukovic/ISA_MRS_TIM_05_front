export const _handleAddAdditionalServiceChip = (data, additionalServices, setAdditionalServices) => {
    let sName = data.additionalService;
    let newKey = 1;
    if (additionalServices.length != 0) {
        for (let chip of additionalServices) {
            if (chip.serviceName.toLowerCase() === sName.toLowerCase())
                return;
        }
        newKey = Math.max.apply(Math, additionalServices.map(chip => chip.key)) + 1;
    }
    let newAmount = data.amount;
    let newObj = {
        "key": newKey,
        "serviceName": sName,
        "price": newAmount
    };
    let newChipData = [...additionalServices];
    newChipData.push(newObj);
    setAdditionalServices(newChipData);
}

export const _setInitialAdditionalServices = (data, setAdditionalServices) => {
    let serviceData = []
    for (let s of data) {
        let newObj = {
            "key": s.id,
            "serviceName": s.serviceName,
            "price": s.price
        };
        serviceData.push(newObj);
    }
    setAdditionalServices(serviceData);
}

export const _getAdditionalServicesJson = (additionalServices) => {
    if (additionalServices.length === 0) {
        return []
    }
    let retVal = [];
    for (let service of additionalServices) {
        retVal.push({
            serviceName: service.serviceName,
            price: service.price
        });
    }
    return retVal;
}