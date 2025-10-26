import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/pt-br";
import "dayjs/locale/en";
import i18n from "@/i18n";

dayjs.extend(localizedFormat);

export const dateHelper = {
  formatDateTime(date: string) {
    return dayjs(date).locale(i18n.language).format("L HH:mm:ss");
  },
};
