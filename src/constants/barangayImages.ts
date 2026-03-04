export const barangayImages: Record<string, any> = {
    'Addition Hills': require('../../assets/images/weatherImages/AdditionHills.jpg'),
    'Balong-Bato': require('../../assets/images/weatherImages/BalongBato.png'),
    'Batis': require('../../assets/images/weatherImages/Batis.jpg'),
    'Corazon de Jesus': require('../../assets/images/weatherImages/Corazon.jpg'),
    'Ermitaño': require('../../assets/images/weatherImages/Ermitano.png'),
    'Greenhills': require('../../assets/images/weatherImages/Greenhills.jpg'),
    'Isabelita': require('../../assets/images/weatherImages/Isabelita.png'),
    'Kabayanan': require('../../assets/images/weatherImages/Kabayanan.jpg'),
    'Little Baguio': require('../../assets/images/weatherImages/LilBaguio.jpg'),
    'Maytunas': require('../../assets/images/weatherImages/Maytunas.jpg'),
    'Onse': require('../../assets/images/weatherImages/Onse.jpeg'),
    'Pasadena': require('../../assets/images/weatherImages/Pasadena.jpg'),
    'Pedro Cruz': require('../../assets/images/weatherImages/PedroCruz.jpg'),
    'Progreso': require('../../assets/images/weatherImages/Progreso.jpg'),
    'Rivera': require('../../assets/images/weatherImages/Rivera.jpg'),
    'Saint Joseph': require('../../assets/images/weatherImages/SaintJoseph.png'),
    'Salapan': require('../../assets/images/weatherImages/Salapan.png'),
    'San Perfecto': require('../../assets/images/weatherImages/SanPerfecto.jpg'),
    'Santa Lucia': require('../../assets/images/weatherImages/SantaLucia.jpg'),
    'Tibagan': require('../../assets/images/weatherImages/Tibagan.png'),
    'West Crame': require('../../assets/images/weatherImages/WestCrame.png'),
};

export const getDefaultBarangayImage = () => require('../../assets/images/weatherImages/Onse.jpeg');

export const getBarangayImage = (barangayName?: string) => {
    if (!barangayName) return getDefaultBarangayImage();
    const image = barangayImages[barangayName];
    return image || getDefaultBarangayImage();
};
