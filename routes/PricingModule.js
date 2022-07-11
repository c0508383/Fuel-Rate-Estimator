module.exports = {
    calculateTotal: (gallonsRequested, pricePerGallon) => {
        return Math.round(gallonsRequested * pricePerGallon *100)/100;
    },
    pricePerGallon: (fuelQuotes, inState, gallonsRequested) => {
        let locationFactor = inState ? 0.02 : 0.04;
        let rateHistoryFactor = fuelQuotes.length > 0 ? 0.01 : 0.0;
        let gallonsReqFactor = gallonsRequested > 1000 ? 0.02 : 0.03;

        let pricePerGallon = 1.5 * (1 + locationFactor - rateHistoryFactor + gallonsReqFactor + 0.1);
        return Math.round(pricePerGallon*100000)/100000;
    }
};