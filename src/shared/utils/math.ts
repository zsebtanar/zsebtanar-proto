export function randomInt(max = 10) {
  return Math.floor(Math.random() * max)
}

export function randomIntBetween(min = 1, max = 10) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function rangeBetween(start = 1, end = 10) {
  const length = end - start;
  return Array.from({ length }, (_, i) => start + i);
}

export function floatEq(a: number, b: number): boolean {
  return a === b || (a >= b - Number.EPSILON && a <= b + Number.EPSILON)
}

// Source: https://www.nayuki.io/page/calculate-divisors-javascript
export function listDivisors(n: number): Array<number> {
  if (n < 1) {
    throw new Error('Number out of range (< 1)');
  } else if (n > 1000000) {
    throw new Error('Number too large');
  }
  var small: number[] = [];
  var large: number[] = [];
  var end = Math.floor(Math.sqrt(n));
  for (var i: number = 1; i <= end; i++) {
    if (n % i == 0) {
      small.push(i);
      if (i * i != n)  // Don't include a square root twice
        large.push(n / i);
    }
  }
  large.reverse();
  return small.concat(large);
}

