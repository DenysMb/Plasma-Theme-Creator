import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useEffect, useMemo, useState } from "react";
import Audio from "../../assets/images/audio.svg?react";
import Battery from "../../assets/images/battery.svg?react";
import Network from "../../assets/images/network.svg?react";
import Notification from "../../assets/images/notification.svg?react";
import KDE from "../../assets/images/kde.svg?react";
import Styles from "./MainView.module.scss";
import { COLORS, PLASMARC, METADATA, hexToRgb } from "../../shared/utils";
import DialogsBackground from "../../assets/translucent/dialogs/background.svgz";
import TranslucentBackground from "../../assets/translucent/widgets/background.svgz";
import TranslucentTooltip from "../../assets/translucent/widgets/tooltip.svgz";
import TranslucentPanelBackground from "../../assets/translucent/widgets/panel-background.svgz";
import SolidBackground from "../../assets/solid/widgets/background.svgz";
import SolidTooltip from "../../assets/solid/widgets/tooltip.svgz";
import SolidPanelBackground from "../../assets/solid/widgets/panel-background.svgz";
import SolidPanelBackgroundWithBorder from "../../assets/solid/widgets/panel-background-with-border.svgz";

const MainView = () => {
  const [backgroundColor, setBackgroundColor] = useState("#272b42");
  const [textColor, setTextColor] = useState("#ffffff");
  const [accentColor, setAccentColor] = useState("#1d7b84");
  const [isColorSchemeAccentColorUsed, setIsColorSchemeAccentColorUsed] = useState(true);
  const [translucentWidgets, setTranslucentWidgets] = useState(true);
  const [usePanelBorder, setUsePanelBorder] = useState(false);
  const [themeName, setThemeName] = useState("Breeze Slate");
  const themeId = useMemo(() => {
    const normalizedText = themeName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const alphanumericText = normalizedText.replace(/[^a-zA-Z\s]/g, "");
    const lowercaseText = alphanumericText.toLowerCase();
    const normalizedPhrase = lowercaseText.replace(/\s+/g, "-");
    return normalizedPhrase;
  }, [themeName]);

  useEffect(() => {
    const hex = backgroundColor.replace("#", "");

    const red = parseInt(hex.substring(0, 2), 16);
    const green = parseInt(hex.substring(2, 4), 16);
    const blue = parseInt(hex.substring(4, 6), 16);

    const relativeLuminance = (red * 0.299 + green * 0.587 + blue * 0.114) / 255;

    const backgroundAccentColor = relativeLuminance > 0.5 ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)";
    const borderAccentColor = relativeLuminance > 0.5 ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.2)";

    const inactivePanelApp = document.getElementById("InactivePanelApp");

    if (inactivePanelApp) {
      inactivePanelApp.style.backgroundColor = backgroundAccentColor;
      inactivePanelApp.style.borderColor = borderAccentColor;
    }
  }, [backgroundColor]);

  useEffect(() => {
    const panelMockup = document.getElementById("PanelMockup");
    const panelApp = document.getElementById("PanelApp");
    const svgItems = document.querySelectorAll("g,path");

    if (panelMockup && panelApp) {
      panelMockup.style.backgroundColor = backgroundColor;
      panelMockup.style.color = textColor;
      panelApp.style.backgroundColor = accentColor + "33";
      panelApp.style.borderColor = accentColor;

      svgItems.forEach((svgItem) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        svgItem.style.fill = textColor;
      });
    }
  }, [backgroundColor, textColor, accentColor]);

  const downloadScheme = async () => {
    let newColors = COLORS;
    const newMetadata = METADATA;

    const backgroundNormalRegex = new RegExp("(BackgroundNormal.*)", "g");
    const backgroundAlternateRegex = new RegExp("(BackgroundAlternate.*)", "g");
    const foregroundNormalRegex = new RegExp("(ForegroundNormal.*)", "g");
    const decorationFocusRegex = new RegExp("(DecorationFocus.*)", "g");
    const decorationHoverRegex = new RegExp("(DecorationHover.*)", "g");
    const nameRegex = new RegExp("(Name.*)", "g");
    const colorSchemeRegex = new RegExp("(ColorScheme.*)", "g");

    newColors = newColors.replace(backgroundNormalRegex, `BackgroundNormal=${hexToRgb(backgroundColor)}`);
    newColors = newColors.replace(backgroundAlternateRegex, `BackgroundAlternate=${hexToRgb(backgroundColor)}`);
    newColors = newColors.replace(foregroundNormalRegex, `ForegroundNormal=${hexToRgb(textColor)}`);
    newColors = newColors.replace(decorationFocusRegex, `DecorationFocus=${hexToRgb(accentColor)}`);
    newColors = newColors.replace(decorationHoverRegex, `DecorationHover=${hexToRgb(accentColor)}`);
    newColors = newColors.replace(nameRegex, `Name=${themeName}`);
    newColors = newColors.replace(colorSchemeRegex, `ColorScheme=${themeId}`);

    if (!isColorSchemeAccentColorUsed) {
      newColors = newColors.replaceAll("#", "");
    }

    newMetadata.KPlugin.Name = themeName;
    newMetadata.KPlugin.Id = themeId;

    const zip = new JSZip();

    const PanelBackground = usePanelBorder ? SolidPanelBackgroundWithBorder : SolidPanelBackground;

    const filesToDownload = [
      { path: `${themeId}/translucent/dialogs/background.svgz`, content: DialogsBackground },
      { path: `${themeId}/opaque/dialogs/background.svgz`, content: DialogsBackground },
      { path: `${themeId}/solid/dialogs/background.svgz`, content: DialogsBackground },
      { path: `${themeId}/translucent/wdigets/background.svgz`, content: TranslucentBackground },
      { path: `${themeId}/translucent/wdigets/tooltip.svgz`, content: TranslucentTooltip },
      { path: `${themeId}/translucent/wdigets/panel-background.svgz`, content: TranslucentPanelBackground },
      { path: `${themeId}/opaque/wdigets/background.svgz`, content: SolidBackground },
      { path: `${themeId}/opaque/wdigets/tooltip.svgz`, content: SolidTooltip },
      { path: `${themeId}/opaque/wdigets/panel-background.svgz`, content: PanelBackground },
      { path: `${themeId}/solid/wdigets/background.svgz`, content: SolidBackground },
      { path: `${themeId}/solid/wdigets/tooltip.svgz`, content: SolidTooltip },
      { path: `${themeId}/solid/wdigets/panel-background.svgz`, content: PanelBackground },
      { path: `${themeId}/colors`, content: newColors },
      { path: `${themeId}/plasmarc`, content: PLASMARC },
      { path: `${themeId}/metadata.json`, content: JSON.stringify(newMetadata, null, 2) },
    ];

    filesToDownload.forEach((file) => {
      zip.file(file.path, file.content);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });

    saveAs(zipBlob, `${themeId}.zip`);
  };

  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className={Styles.MainViewContainer}>
      <div className={Styles.PanelOptions}>
        <div className={Styles.Option}>
          <label htmlFor="themeName">Theme Name:</label>
          <div>
            <input name="themeName" type="text" onChange={(e) => setThemeName(e.target.value)} value={themeName} />
          </div>
        </div>

        <div className={`${Styles.Option} ${Styles.OptionDisabled}`}>
          <label htmlFor="themeId">Theme Id:</label>
          <div>
            <input name="themeId" type="text" value={themeId} disabled />
          </div>
        </div>

        <div className={Styles.Option}>
          <label htmlFor="backgroundColor">Background Color:</label>
          <div>
            <input name="backgroundColor" type="color" onChange={(e) => setBackgroundColor(e.target.value)} value={backgroundColor} />
          </div>
        </div>

        <div className={Styles.Option}>
          <label htmlFor="textColor">Text Color:</label>
          <div>
            <input name="textColor" type="color" onChange={(e) => setTextColor(e.target.value)} value={textColor} />
          </div>
        </div>

        <div className={Styles.Option}>
          <label htmlFor="isColorSchemeAccentColorUsed">Use color scheme accent color:</label>
          <div>
            <input
              name="isColorSchemeAccentColorUsed"
              type="checkbox"
              onChange={(e) => setIsColorSchemeAccentColorUsed(e.target.checked)}
              checked={isColorSchemeAccentColorUsed}
            />
          </div>
        </div>

        <div className={`${Styles.Option} ${isColorSchemeAccentColorUsed && Styles.OptionDisabled}`}>
          <label htmlFor="accentColor">Accent Color:</label>
          <div>
            <input
              name="accentColor"
              type="color"
              onChange={(e) => setAccentColor(e.target.value)}
              value={accentColor}
              disabled={isColorSchemeAccentColorUsed}
            />
          </div>
        </div>

        <div className={Styles.Option}>
          <label htmlFor="translucentWidgets">Use translucent widgets even with opaque panel:</label>
          <div>
            <input
              name="translucentWidgets"
              type="checkbox"
              onChange={(e) => setTranslucentWidgets(e.target.checked)}
              checked={translucentWidgets}
            />
          </div>
        </div>

        <div className={`${Styles.Option} ${!translucentWidgets && Styles.OptionDisabled}`}>
          <label htmlFor="usePanelBorder">Use border for opaque panel:</label>
          <div>
            <input
              name="usePanelBorder"
              type="checkbox"
              onChange={(e) => setUsePanelBorder(e.target.checked)}
              checked={usePanelBorder}
              disabled={!translucentWidgets}
            />
          </div>
        </div>

        <button onClick={downloadScheme}>Download Panel Color Scheme</button>
      </div>

      <div className={Styles.PanelPreview}>
        <div id="PanelMockup" className={Styles.PanelMockup}>
          <div className={Styles.PanelElements}>
            <KDE /> Menu │ ● ○ │
            <div id="PanelApp" className={Styles.PanelApp}>
              📁 Dolphin
            </div>
            <div id="InactivePanelApp" className={Styles.PanelApp}>
              🌐 Browser
            </div>
          </div>

          <span className={Styles.PanelTray}>
            <Audio /> <Battery /> <Network /> │ <div className={Styles.PanelClock}> {time} </div> │ <Notification />
          </span>
        </div>
      </div>
    </div>
  );
};

export default MainView;
