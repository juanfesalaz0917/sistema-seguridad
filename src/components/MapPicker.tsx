import type React from 'react';
import { useEffect, useState } from 'react';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Box, Paper, Typography } from '@mui/material';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPickerProps {
    latitude?: number;
    longitude?: number;
    onLocationChange?: (lat: number, lng: number) => void;
    interactive?: boolean;
}

interface LocationMarkerProps {
    position: [number, number];
    setPosition: (position: [number, number]) => void;
    interactive: boolean;
}

function LocationMarker({
    position,
    setPosition,
    interactive,
}: LocationMarkerProps) {
    useMapEvents({
        click(e) {
            if (interactive) {
                setPosition([e.latlng.lat, e.latlng.lng]);
            }
        },
    });

    return position ? (
        <Marker position={position}>
            <Popup>
                Ubicación seleccionada: <br />
                Lat: {position[0].toFixed(6)} <br />
                Lng: {position[1].toFixed(6)}
            </Popup>
        </Marker>
    ) : null;
}

const MapPicker: React.FC<MapPickerProps> = ({
    latitude = 4.6097,
    longitude = -74.0817,
    onLocationChange,
    interactive = true,
}) => {
    const [position, setPosition] = useState<[number, number]>([
        latitude,
        longitude,
    ]);

    useEffect(() => {
        if (latitude && longitude) {
            setPosition([latitude, longitude]);
        }
    }, [latitude, longitude]);

    const handlePositionChange = (newPosition: [number, number]) => {
        setPosition(newPosition);
        if (onLocationChange) {
            onLocationChange(newPosition[0], newPosition[1]);
        }
    };

    return (
        <Paper
            variant="outlined"
            sx={{
                width: '100%',
                height: 384, // Tailwind h-96 === 24rem === 384px
                borderRadius: 2,
                overflow: 'hidden',
                borderColor: 'divider',
            }}
        >
            <Box sx={{ height: '100%', width: '100%' }}>
                <MapContainer
                    center={position}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={interactive}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker
                        position={position}
                        setPosition={handlePositionChange}
                        interactive={interactive}
                    />
                </MapContainer>
            </Box>

            {interactive && (
                <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        💡 Click en el mapa para seleccionar una ubicación
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};

export default MapPicker;
