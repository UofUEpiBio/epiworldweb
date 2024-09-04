function getRandomElement(arr: any[]) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomGeographicOrigin() {
	const regions = ['North America', 'South America', 'Europe', 'Asia', 'Africa', 'Australia'];
	return `${getRandomElement(regions)} ${Math.floor(Math.random() * 1000)}`; // Adding a random number for uniqueness
}

function generateRandomYear() {
	const currentYear = new Date().getFullYear();
	return Math.floor(Math.random() * (currentYear - 1900 + 1)) + 1900;
}

function generateRandomSubtype() {
	const types = ['L', 'R'];
	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	const randomType = getRandomElement(types);
	const randomNumber = getRandomElement(numbers);
	return `${randomType}${randomNumber}`;
}

export function generateRandomInfluenzaStrainName() {
	const virusTypes = ['F', 'A', 'K', 'E'];

	const virusType = getRandomElement(virusTypes);
	const geographicOrigin = generateRandomGeographicOrigin();
	const strainNumber = Math.floor(Math.random() * 1000) + 1; // Random number between 1 and 1000
	const yearOfIsolation = generateRandomYear();
	const subtype = generateRandomSubtype();

	return `${virusType}/${geographicOrigin}/${strainNumber}/${yearOfIsolation}/${subtype}`;
}
