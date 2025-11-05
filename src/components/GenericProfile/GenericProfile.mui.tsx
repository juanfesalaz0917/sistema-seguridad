import React from "react";
import { Box, Button, Typography, Avatar, Stack } from "@mui/material";
import type { ProfileProps } from "./types";

const GenericProfileMui: React.FC<ProfileProps> = ({ data, onEdit }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.100",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 6,
          width: "100%",
          maxWidth: 900,
          bgcolor: "background.paper",
          borderRadius: 2,
          p: 6,
          boxShadow: 3,
        }}
      >
        {/* Imagen */}
        <Avatar
          src={data.avatarUrl ?? "/images/default-avatar.png"}
          alt="Avatar"
          sx={{ width: 256, height: 256 }}
        />

        {/* Datos */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h2" gutterBottom>
            {data.name}
          </Typography>
          <Typography variant="h5" gutterBottom>
            <strong>Email:</strong> {data.email}
          </Typography>
          <Typography variant="h5" gutterBottom>
            <strong>Teléfono:</strong> {data.phone ?? "No disponible"}
          </Typography>

          <Stack direction="row" spacing={2} mt={4} flexWrap="wrap">
            {onEdit && (
              <Button variant="contained" color="primary" size="large" onClick={onEdit}>
                Editar Perfil
              </Button>
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default GenericProfileMui;
