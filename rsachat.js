// Javascript program Miller-Rabin primality test
// based on JavaScript code found at https://www.geeksforgeeks.org/primality-test-set-3-miller-rabin/

// Utility function to do
// modular exponentiation.
// It returns (x^y) % p
function power(x, y, p)
{
	
	// Initialize result 
    // (JML- all literal integers converted to use n suffix denoting BigInt)
	let res = 1n;
	
	// Update x if it is more than or
	// equal to p
	x = x % p;
	while (y > 0n)
	{
		
		// If y is odd, multiply
		// x with result
		if (y & 1n)
			res = (res*x) % p;

		// y must be even now
		y = y/2n; // (JML- original code used a shift operator, but division is clearer)
		x = (x*x) % p;
	}
	return res;
}
// This function is called
// for all k trials. It returns
// false if n is composite and
// returns false if n is
// probably prime. d is an odd
// number such that d*2<sup>r</sup> = n-1
// for some r >= 1
function miillerTest(d, n)
{
    // (JML- all literal integers converted to use n suffix denoting BigInt)
	
	// Pick a random number in [2..n-2]
	// Corner cases make sure that n > 4
    /* 
        JML- I can't mix the Number returned by Math.random with
        operations involving BigInt. The workaround is to create a random integer 
        with precision 6 and convert it to a BigInt.
    */  
    const r = BigInt(Math.floor(Math.random() * 100_000))
    // JML- now I have to divide by the multiplier used above (BigInt version)
    const y = r*(n-2n)/100_000n
	let a = 2n + y % (n - 4n);

	// Compute a^d % n
	let x = power(a, d, n);

	if (x == 1n || x == n-1n)
		return true;

	// Keep squaring x while one
	// of the following doesn't
	// happen
	// (i) d does not reach n-1
	// (ii) (x^2) % n is not 1
	// (iii) (x^2) % n is not n-1
	while (d != n-1n)
	{
		x = (x * x) % n;
		d *= 2n;

		if (x == 1n)	
			return false;
		if (x == n-1n)
			return true;
	}

	// Return composite
	return false;
}

// It returns false if n is
// composite and returns true if n
// is probably prime. k is an
// input parameter that determines
// accuracy level. Higher value of
// k indicates more accuracy.
function isPrime(n, k=100)
{
	// (JML- all literal integers converted to use n suffix denoting BigInt)
	// Corner cases
	if (n <= 1n || n == 4n) return false;
	if (n <= 3n) return true;

	// Find r such that n =
	// 2^d * r + 1 for some r >= 1
	let d = n - 1n;
	while (d % 2n == 0n)
		d /= 2n;

	// Iterate given nber of 'k' times
	for (let i = 0; i < k; i++)
		if (!miillerTest(d, n))
			return false;

	return true;
};

function bigintAbs(bigint) {
	if(typeof bigint !== "bigint") throw new TypeError();
	if(bigint >= 0n) return bigint;
	return -1n*bigint;
};

function gcd(x, y) {
	if(!y) return x;
	return gcd(y, x%y);
};

function Euclid_gcd(a, b) { //professional ^C^V
  if (a !== a || b !== b) {
    return [NaN, NaN, NaN];
  }
  
  if (a === Infinity || a === -Infinity || b === Infinity || b === -Infinity) {
    return [Infinity, Infinity, Infinity];
  }
  if ((a % 1n !== 0n) || (b % 1n !== 0n)) {
    return false;
  }
  let signX = (a < 0n) ? -1n : 1n,
    signY = (b < 0n) ? -1n : 1n,
    x = 0n,
    y = 1n,
    u = 1n,
    v = 0n,
    q, r, m, n;

  while (a !== 0n) {
    q = b/a;
    r = b % a;
    m = x - u * q;
    n = y - v * q;
    b = a;
    a = r;
    x = u;
    y = v;
    u = m;
    v = n;
  }
  return [b, signX * x, bigintAbs(signY*y)];
};

function modularExponent(x, a, n) {
	if(!a) {
		return 1n;
	} else if (a % 2n === 1n) {
		return x*modularExponent(x, a-1n, n) % n;
	} else {
		half = modularExponent(x, a/2n, n);
		return half * half % n;
	}
};

function messageToInt(message) {
	if(typeof message !== "string") throw new TypeError();
	
	let output = "";
	
	for(let i = 0; i < message.length; i++) {
		if(message[i].charCodeAt(0) > 0xff) throw new RangeError();
		output += message[i].charCodeAt(0).toString(2).padStart(8,0);
	};
	
	return BigInt(`0b${output}`);
};

function intToMessage(value) {
	let q = value.toString(2);
	if(BigInt(q.length) % 8n) q = ("0".repeat(Number(8n - (BigInt(q.length) % 8n))))+q;
	
	q = q.match(/.{8}/g).map(bit => String.fromCharCode(Number(`0b${bit}`)));
	
	return q.join("");
};

function isDivisibleBy(num, den) {
	if(typeof num !== "bigint") throw new TypeError();
	if(typeof den !== "bigint") throw new TypeError();
	
	return !(num % den);
};

function randomNumber(len=24) { // len x => max value 10**x;
	let out = "123456789"[Math.floor(Math.random()*9)];
	for(let i = 0; i < len-1; i++) {
		out += "1234567890"[Math.floor(Math.random()*10)];
	};
	
	return BigInt(out);
};

function artificialBoost(bigint) {
	return BigInt(bigint.toString()+(["1","3","7","9"][Math.floor(Math.random()*4)]));
};

function largePrimeNumber() {
	const MAX_ATTEMPTS = 100000; //this is only ran to make keys, not send messages
	let primeGuess;
	for(let i = 0; i < MAX_ATTEMPTS; i++) {
		primeGuess = artificialBoost(200000000000000000000000000n+randomNumber());
		if(isPrime(primeGuess)) {
			return primeGuess;
		};
	};
	
	return null;
};

function generatePublicExponent(phiProduct, attempts=100) {
	if(phiProduct < 1000n) throw new RangeError();
	if(typeof phiProduct !== "bigint") throw new TypeError();
	for(let i = 0; i < attempts; i++) {
		let guess = randomNumber(phiProduct.toString().length-1);
		if(guess < 2n || guess >= phiProduct) continue;
		if(! (guess % 2n)) guess -= 1n; //even to odd
		
		if(gcd(guess, phiProduct) === 1n) return guess;
	};
	return generatePublicExponent(phiProduct, attempts); //:lenny:
};

function generatePrivateExponent(phiProduct, publicE, attempts=100000) {
	if(typeof phiProduct !== "bigint") throw new TypeError();
	if(typeof publicE !== "bigint") throw new TypeError();
	
	if(gcd(phiProduct, publicE) !== 1n) throw new Error("Bad public exponent given");
		
	let candidate = Euclid_gcd(publicE, phiProduct);
	
	for(let i = 0; i < attempts; i++) {
		if((bigintAbs(candidate[1])*publicE % phiProduct) === 1n) return bigintAbs(candidate[1]);
		if((bigintAbs(candidate[2])*publicE % phiProduct) === 1n) return bigintAbs(candidate[2]);
	};
	
	return 0n; //temporary
};

function generateRSAKeys() {
	let out = {
		prime1: largePrimeNumber(),
		prime2: largePrimeNumber()
	};
	
	out.product = out.prime1*out.prime2;
	out.phiProduct = (out.prime1-1n)*(out.prime2-1n);
	out.publicE = generatePublicExponent(out.phiProduct, 1000);
	out.privE = generatePrivateExponent(out.phiProduct, out.publicE);
	
	return {
		...out,
		lockMessage: function(string) {
			if(typeof string !== "string") throw new TypeError();
			let numericized = messageToInt(string);
			return modularExponent(numericized, out.publicE, out.product);
		},
		
		unlockMessage: function(number) {
			if(typeof number !== "bigint") throw new TypeError();
			console.log(out.privE * out.publicE % out.phiProduct);
			let unlocked = modularExponent(number, out.privE, out.product);
			return intToMessage(unlocked);
		}
	};
};
