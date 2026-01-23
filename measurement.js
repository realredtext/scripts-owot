/*
1 Y coordinate up = 4 tiles up = 32 chars up
1 X coordinate right = 4 tiles right = 64 chars right
1 coord² = 16 tiles² = 2048 chars²
*/

let tileMeasurer = new RegionSelection();
tileMeasurer.charColor = "#FFFF00";
tileMeasurer.color = "rgba(128, 128, 0, 0.1)";
tileMeasurer.tiled = true;
tileMeasurer.init();

tileMeasurer.onselection(function(coordA, coordB, regWidth, regHeight) {
    let minTileX = coordA[0];
    let minTileY = coordA[1];
    let maxTileX = coordB[0];
    let maxTileY = coordB[1];
	let measuredXTiles = (maxTileX - minTileX) + 1;
	let measuredYTiles = (maxTileY - minTileY) + 1;
	let measuredXChars = measuredXTiles * 16;
	let measuredYChars = measuredYTiles * 8;
	let measuredXCoords = measuredXTiles / 4;
	let measuredYCoords = measuredYTiles / 4;
    let measuredCoordArea = measuredXCoords * measuredYCoords;
	MeasurementManager.core.send(`<br>Coordinates:<br>X: ${measuredXCoords},<br>Y: ${measuredYCoords}<br>Area: ${measuredCoordArea} coords²<br>Tiles:<br>X: ${measuredXTiles},<br>Y: ${measuredYTiles}<br>Area: ${measuredCoordArea*16} tiles²<br>Chars:<br>X: ${measuredXChars},<br>Y: ${measuredYChars}<br>Area: ${measuredCoordArea*16*128} chars²`, true)
});

let charMeasurer = new RegionSelection();
charMeasurer.charColor = "#00FFFF";
charMeasurer.color = "rgba(0, 128, 128, 0.1)";
charMeasurer.init();

charMeasurer.onselection(function(coordA, coordB, regWidth, regHeight) {
	let measuredXTiles = regWidth / 16;
	let measuredYTiles = regHeight / 8;
    let measuredTileArea = measuredXTiles * measuredYTiles;
	MeasurementManager.core.send(`<br>Chars:<br>X: ${regWidth},<br>Y: ${regHeight}<br>Area: ${measuredTileArea*128} chars²<br>Tiles:<br>X: ${measuredXTiles},<br>Y: ${measuredYTiles}<br>Area: ${measuredTileArea} tiles²`, true);
});

let { ManagerCommandWrapper } = use("realredtext/scripts-owot/managers.js");

let MeasurementManager = new ManagerCommandWrapper("Measurer", "#dddd00", {
	"tile": () => {
		tileMeasurer.startSelection();
		return `Tile measurement started`;
	},
	"char": () => {
		charMeasurer.startSelection();
		return `Character measurement started`;
	}
}, "measurer", ["tile", "char"]);
