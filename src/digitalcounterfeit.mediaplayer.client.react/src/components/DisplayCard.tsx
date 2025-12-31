import { Card, Typography, type SxProps, type Theme } from "@mui/material";

interface IDisplayCardProps {
    sx?: SxProps<Theme> | undefined
    name?: string | undefined
    imageUri?: string | undefined    
    onClick?: () => void
}

const displayCardStyle = (enableHover: boolean | undefined, imageUri?: string | undefined) => ({
  display: "flex",
  flexFlow: "column-reverse",
  width: 148,
  height: 136,
  borderRadius: 1,    
  m: "3px",
  backgroundColor: "primary.main",
  ...(enableHover && {
    "&:hover": {
      cursor: "pointer",
      bgcolor: "primary.dark",
      WebkitBoxShadow: "0px 0px 3px 3px rgb(165, 163, 163)",
      boxShadow: "0px 0px 3px 3px rgb(165, 163, 163);",
    },
  }),
  ...(imageUri && {
      backgroundImage: `url(${imageUri})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
  })  
});

const nameStyle = {
  postition: "absolute",
  width: "130px",
  ml: "8px",
  mr: "8px",
  mb: "4px",
  color: "whitesmoke",
  textShadow: `
    0 1px 6px rgba(0, 0, 0, 1.0),
    0 1px 6px rgba(0, 0, 0, 1.0)
  `,
};

export default function DisplayCard({ sx, name, imageUri, onClick } : IDisplayCardProps) {  
  
  return (
    <Card
      sx={{
        ...displayCardStyle(onClick && true, imageUri),
        ...sx,        
      }}
      onClick={onClick}>
      <Typography variant="subtitle2" sx={nameStyle}>
        {name}
      </Typography>
    </Card>
  );
}