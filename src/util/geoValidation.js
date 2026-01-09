/**
 * Límites oficiales de la Delegación Tláhuac según INEGI
 * 
 * Fuente: Marco Geoestadístico Nacional - INEGI
 * Longitud: 99°04'08.40" W a 98°56'25.08" W
 * Latitud: 19°12'38.16" N a 19°19'37.56" N
 */
export const TLAHUAC_BOUNDS = {
    minLat: 19.21060,   // 19°12'38.16" N (Sur)
    maxLat: 19.32710,   // 19°19'37.56" N (Norte)
    minLng: -99.06900,  // 99°04'08.40" W (Oeste)
    maxLng: -98.94030   // 98°56'25.08" W (Este)
}

/**
 * @param {number} latitude - Latitud en formato decimal
 * @param {number} longitude - Longitud en formato decimal
 * @returns {boolean} - true si está dentro de Tláhuac
 */
export function isWithinTlahuac(latitude, longitude) {
    return (
        latitude >= TLAHUAC_BOUNDS.minLat &&
        latitude <= TLAHUAC_BOUNDS.maxLat &&
        longitude >= TLAHUAC_BOUNDS.minLng &&
        longitude <= TLAHUAC_BOUNDS.maxLng
    )
}

/**
 * Obtiene un mensaje de error detallado si las coordenadas están fuera
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {string|null} - Mensaje de error o null si está dentro
 */
export function getLocationError(latitude, longitude) {
    if (isWithinTlahuac(latitude, longitude)) {
        return null
    }

    let direction = ''

    if (latitude < TLAHUAC_BOUNDS.minLat) {
        direction = 'al sur de'
    } else if (latitude > TLAHUAC_BOUNDS.maxLat) {
        direction = 'al norte de'
    } else if (longitude < TLAHUAC_BOUNDS.minLng) {
        direction = 'al oeste de'
    } else if (longitude > TLAHUAC_BOUNDS.maxLng) {
        direction = 'al este de'
    }

    return `Las coordenadas están ${direction} la Delegación Tláhuac`
}

/**
 * @returns {{latitude: number, longitude: number}}
 */
export function getRandomCoordinatesInTlahuac() {
    const latitude = TLAHUAC_BOUNDS.minLat + 
        Math.random() * (TLAHUAC_BOUNDS.maxLat - TLAHUAC_BOUNDS.minLat)
    
    const longitude = TLAHUAC_BOUNDS.minLng + 
        Math.random() * (TLAHUAC_BOUNDS.maxLng - TLAHUAC_BOUNDS.minLng)
    
    return { 
        latitude: Math.round(latitude * 100000) / 100000,   // 5 decimales
        longitude: Math.round(longitude * 100000) / 100000  // 5 decimales
    }
}

/**
 * @returns {{latitude: number, longitude: number}}
 */
export function getTlahuacCenter() {
    return {
        latitude: (TLAHUAC_BOUNDS.minLat + TLAHUAC_BOUNDS.maxLat) / 2,
        longitude: (TLAHUAC_BOUNDS.minLng + TLAHUAC_BOUNDS.maxLng) / 2
    }
}