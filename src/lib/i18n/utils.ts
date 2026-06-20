const STATION_CODE_RE = /^[A-Z]{2,5}$/;

export function stationLabel(t: (key: string) => string, codeOrName: string): string {
  return STATION_CODE_RE.test(codeOrName) ? t("station." + codeOrName) : codeOrName;
}
