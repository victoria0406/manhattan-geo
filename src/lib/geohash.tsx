export function encodeGeohash(latitude:number, longitude:number, precision = 9) {
  const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz'; // Geohash 문자 집합

  // Geohash 범위 설정
  let minLat = -90.0;
  let maxLat = 90.0;
  let minLng = -180.0;
  let maxLng = 180.0;

  let geohash = '';
  let bit = 0;
  let ch = 0;

  while (geohash.length < precision) {
    let mid;
    if (bit % 2 === 0) {
      mid = (minLng + maxLng) / 2;
      if (longitude > mid) {
        ch |= 1 << (4 - (bit % 5));
        minLng = mid;
      } else {
        maxLng = mid;
      }
    } else {
      mid = (minLat + maxLat) / 2;
      if (latitude > mid) {
        ch |= 1 << (4 - (bit % 5));
        minLat = mid;
      } else {
        maxLat = mid;
      }
    }

    if (bit % 5 === 4) {
      geohash += BASE32[ch];
      ch = 0;
    }

    bit += 1;
  }

  return geohash;
}

export function decodeGeohash(geohash:string) {
  const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz'; // Geohash 문자 집합
  // const BITS = [16, 8, 4, 2, 1]; // 각 문자에 해당하는 비트 수

  // Geohash 범위 설정
  let minLat = -90.0;
  let maxLat = 90.0;
  let minLng = -180.0;
  let maxLng = 180.0;

  let isEven = true;
  for (let i = 0; i < geohash.length; i += 1) {
    const char = geohash[i];
    const index = BASE32.indexOf(char);

    for (let j = 0; j < 5; j += 1) {
      const bit = (index >> (4 - j)) & 1;
      if (isEven) {
        const midLng = (minLng + maxLng) / 2;
        if (bit === 1) {
          minLng = midLng;
        } else {
          maxLng = midLng;
        }
      } else {
        const midLat = (minLat + maxLat) / 2;
        if (bit === 1) {
          minLat = midLat;
        } else {
          maxLat = midLat;
        }
      }
      isEven = !isEven;
    }
  }

  // Geohash의 경계 좌표를 반환
  const bounds = {
    sw: { lat: minLat, lng: minLng },
    ne: { lat: maxLat, lng: maxLng },
  };

  return bounds;
}
