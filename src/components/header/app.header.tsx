"use client";
import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Container from "@mui/material/Container";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { fetchDefaultImages } from "@/utils/api";
import Image from "next/image";
import ActiveLink from "./active.link";
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "400px",
    },
  },
}));

export default function AppHeader() {
  const { data: session } = useSession();
  // console.log(">>>> check session", session);
  // console.log(">>> check hook", useSession());
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem>
        <Link
          href={`/profile/${session?.user?._id}`}
          style={{
            color: "unset",
            textDecoration: "none",
          }}
        >
          Profile
        </Link>
      </MenuItem>

      <MenuItem
        onClick={() => {
          handleMenuClose();
          signOut();
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={anchorEl}
      id={mobileMenuId}
      keepMounted
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <MenuItem>
        <Link
          href={`/profile/${session?.user?._id}`}
          style={{
            color: "unset",
            textDecoration: "none",
          }}
        >
          Profile
        </Link>
      </MenuItem>
      <MenuItem>
        <Link
          style={{
            color: "unset",
            textDecoration: "none",
          }}
          href={"/playlist"}
        >
          Playlists
        </Link>
      </MenuItem>
      <MenuItem>
        <Link
          style={{
            color: "unset",
            textDecoration: "none",
          }}
          href={"/like"}
        >
          Likes
        </Link>
      </MenuItem>

      <MenuItem>
        <Link
          style={{
            color: "unset",
            textDecoration: "none",
          }}
          href={"/track/upload"}
        >
          Upload
        </Link>
      </MenuItem>

      <MenuItem
        onClick={() => {
          handleMenuClose();
          signOut();
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );
  const handleRedirectHome = () => {
    router.push("/");
  };
  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: "#4c5c6c",
        }}
      >
        <Container>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block", cursor: "pointer" } }}
              onClick={() => handleRedirectHome()}
            >
              ManhTD
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                onKeyDown={(e: any) => {
                  if (e.key === "Enter") {
                    if (e?.target?.value) {
                      router.push(`/search?q=${e?.target?.value}`);
                    }
                  }
                }}
              />
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: "15px",
                alignItems: "center",
                cursor: "pointer",
                padding: "5px",
                "> a": {
                  color: "unset",
                  textDecoration: "none",
                  "&.active": {
                    background: "#3b4a59",
                    color: "#cefaff",
                    borderRadius: "5px",
                  },
                },
              }}
            >
              {session ? (
                <>
                  <ActiveLink href={"/playlist"}>Playlists</ActiveLink>
                  <ActiveLink href={"/like"}>Likes</ActiveLink>
                  <ActiveLink href={"/track/upload"}>Upload</ActiveLink>
                  <Image
                    onClick={handleProfileMenuOpen}
                    style={{ cursor: "pointer" }}
                    src={fetchDefaultImages(session.user.type)}
                    alt="avatar"
                    height={35}
                    width={35}
                  />
                </>
              ) : (
                <>
                  <Link href={"/auth/signin"}>Login</Link>
                </>
              )}
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <Box
                sx={{
                  display: { xs: "flex", md: "none" },
                  gap: "15px",
                  alignItems: "center",
                  cursor: "pointer",
                  "> a": {
                    color: "unset",
                    textDecoration: "none",
                  },
                }}
              >
                {session ? (
                  <>
                    <Image
                      onClick={handleProfileMenuOpen}
                      style={{ cursor: "pointer" }}
                      src={fetchDefaultImages(session.user.type)}
                      alt="avatar"
                      height={35}
                      width={35}
                    />
                  </>
                ) : (
                  <>
                    <Link href={"/auth/signin"}>Login</Link>
                  </>
                )}
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </>
  );
}
