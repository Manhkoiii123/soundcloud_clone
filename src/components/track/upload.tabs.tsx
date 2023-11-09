"use client";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Step1 from "./steps/step1";
import Step2 from "./steps/step2";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
//giúp seo tốt hơn chứ ko có gì ảnh hưởng xóa đi cũng ok
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const UploadTabs = () => {
  //copy từ basic tabs
  const [value, setValue] = React.useState(0);

  const [trackUpload, setTrackUpload] = React.useState({
    fileName: "",
    percent: 0,
    uploadedTrackName: "",
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", border: "1px solid #ccc", mt: 5 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Tracks" {...a11yProps(0)} disabled={value !== 0} />
          <Tab
            label="Basic Information"
            {...a11yProps(1)}
            disabled={value !== 1}
          />
        </Tabs>
      </Box>
      {/* nội dung tab */}
      <CustomTabPanel value={value} index={0}>
        {/* item1 là cái children của CustomTabPanel */}
        <Step1
          trackUpload={trackUpload}
          setValue={setValue}
          setTrackUpload={setTrackUpload}
        ></Step1>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Step2 trackUpload={trackUpload} setValue={setValue} />
      </CustomTabPanel>
    </Box>
  );
};

export default UploadTabs;
