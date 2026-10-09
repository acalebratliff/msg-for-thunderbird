/*! msg-eml-core | Apache-2.0 | Copyright 2026 A. Caleb Ratliff
 * Includes @kenjiuno/msgreader (Apache-2.0, Copyright 2019 HIRAOKA HYPERS TOOLS, Inc.,
 * Copyright 2016 Yury Karpovich, kenjiuno)
 * and @kenjiuno/decompressrtf (BSD-2-Clause, Copyright (c) 2019, kenjiuno).
 * See NOTICE and THIRD_PARTY_LICENSES for the full licence texts.
 */
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@kenjiuno/msgreader/lib/utils.js
var require_utils = __commonJS({
  "node_modules/@kenjiuno/msgreader/lib/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.arraysEqual = arraysEqual;
    exports.uInt2int = uInt2int;
    exports.toHexStr = toHexStr;
    exports.toHex1 = toHex1;
    exports.toHex2 = toHex2;
    exports.toHex4 = toHex4;
    exports.msftUuidStringify = msftUuidStringify;
    exports.emptyToNull = emptyToNull;
    exports.readSystemTime = readSystemTime;
    exports.readTransitionSystemTime = readTransitionSystemTime;
    exports.bin2HexUpper = bin2HexUpper;
    function arraysEqual(a, b) {
      if (a === b)
        return true;
      if (a == null || b == null)
        return false;
      if (a.length != b.length)
        return false;
      for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i])
          return false;
      }
      return true;
    }
    function uInt2int(data) {
      var result = new Array(data.length);
      for (var i = 0; i < data.length; i++) {
        result[i] = data[i] << 24 >> 24;
      }
      return result;
    }
    function toHexStr(value, padding) {
      var text = "";
      while (value != 0) {
        text = "0123456789abcdef"[value & 15] + text;
        value >>= 4;
        text = "0123456789abcdef"[value & 15] + text;
        value >>= 4;
      }
      while (text.length < padding) {
        text = "0" + text;
      }
      return text;
    }
    var hex = "0123456789abcdef";
    function toHex1(value) {
      return hex[value >> 4 & 15] + hex[value & 15];
    }
    function toHex2(value) {
      return hex[value >> 12 & 15] + hex[value >> 8 & 15] + hex[value >> 4 & 15] + hex[value & 15];
    }
    function toHex4(value) {
      return hex[value >> 28 & 15] + hex[value >> 24 & 15] + hex[value >> 20 & 15] + hex[value >> 16 & 15] + hex[value >> 12 & 15] + hex[value >> 8 & 15] + hex[value >> 4 & 15] + hex[value & 15];
    }
    function msftUuidStringify(array, offset) {
      return "" + toHex1(array[offset + 3]) + toHex1(array[offset + 2]) + toHex1(array[offset + 1]) + toHex1(array[offset + 0]) + "-" + toHex1(array[offset + 5]) + toHex1(array[offset + 4]) + "-" + toHex1(array[offset + 7]) + toHex1(array[offset + 6]) + "-" + toHex1(array[offset + 8]) + toHex1(array[offset + 9]) + "-" + toHex1(array[offset + 10]) + toHex1(array[offset + 11]) + toHex1(array[offset + 12]) + toHex1(array[offset + 13]) + toHex1(array[offset + 14]) + toHex1(array[offset + 15]);
    }
    function emptyToNull(text) {
      return text === "" ? null : text;
    }
    function padNumber(value, maxLen) {
      return ("" + value).padStart(maxLen, "0");
    }
    function readSystemTime(ds) {
      var wYear = ds.readUint16();
      var wMonth = ds.readUint16();
      var wDayOfWeek = ds.readUint16();
      var wDay = ds.readUint16();
      var wHour = ds.readUint16();
      var wMinute = ds.readUint16();
      var wSecond = ds.readUint16();
      var wMilliseconds = ds.readUint16();
      var text = "".concat(padNumber(wYear, 4), "-").concat(padNumber(wMonth, 2), "-").concat(padNumber(wDay, 2), "T").concat(padNumber(wHour, 2), ":").concat(padNumber(wMinute, 2), ":").concat(padNumber(wSecond, 2), "Z");
      if (text === "0000-00-00T00:00:00Z") {
        return null;
      } else {
        return new Date(text);
      }
    }
    function readTransitionSystemTime(ds) {
      var wYear = ds.readUint16();
      var wMonth = ds.readUint16();
      var wDayOfWeek = ds.readUint16();
      var wDay = ds.readUint16();
      var wHour = ds.readUint16();
      var wMinute = ds.readUint16();
      var wSecond = ds.readUint16();
      var wMilliseconds = ds.readUint16();
      return {
        year: wYear,
        month: wMonth,
        dayOfWeek: wDayOfWeek,
        day: wDay,
        hour: wHour,
        minute: wMinute
      };
    }
    function bin2HexUpper(ds) {
      var text = "";
      while (!ds.isEof()) {
        text += toHex1(ds.readUint8());
      }
      return text.toUpperCase();
    }
  }
});

// node_modules/@kenjiuno/msgreader/lib/const.js
var require_const = __commonJS({
  "node_modules/@kenjiuno/msgreader/lib/const.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils_1 = require_utils();
    exports.default = {
      FILE_HEADER: (0, utils_1.uInt2int)([208, 207, 17, 224, 161, 177, 26, 225]),
      MSG: {
        UNUSED_BLOCK: -1,
        END_OF_CHAIN: -2,
        S_BIG_BLOCK_SIZE: 512,
        S_BIG_BLOCK_MARK: 9,
        L_BIG_BLOCK_SIZE: 4096,
        L_BIG_BLOCK_MARK: 12,
        SMALL_BLOCK_SIZE: 64,
        BIG_BLOCK_MIN_DOC_SIZE: 4096,
        HEADER: {
          PROPERTY_START_OFFSET: 48,
          BAT_START_OFFSET: 76,
          BAT_COUNT_OFFSET: 44,
          SBAT_START_OFFSET: 60,
          SBAT_COUNT_OFFSET: 64,
          XBAT_START_OFFSET: 68,
          XBAT_COUNT_OFFSET: 72
        },
        PROP: {
          NO_INDEX: -1,
          PROPERTY_SIZE: 128,
          NAME_SIZE_OFFSET: 64,
          MAX_NAME_LENGTH: (
            /*NAME_SIZE_OFFSET*/
            64 / 2 - 1
          ),
          TYPE_OFFSET: 66,
          PREVIOUS_PROPERTY_OFFSET: 68,
          NEXT_PROPERTY_OFFSET: 72,
          CHILD_PROPERTY_OFFSET: 76,
          START_BLOCK_OFFSET: 116,
          SIZE_OFFSET: 120,
          TYPE_ENUM: {
            UNALLOCATED: 0,
            DIRECTORY: 1,
            DOCUMENT: 2,
            ROOT: 5
          }
        },
        FIELD: {
          PREFIX: {
            ATTACHMENT: "__attach_version1.0",
            RECIPIENT: "__recip_version1.0",
            DOCUMENT: "__substg1.",
            NAMEID: "__nameid_version1.0"
          },
          // example (use fields as needed)
          NAME_MAPPING: {
            // email specific
            "001a": "messageClass",
            "0037": "subject",
            "0c1a": "senderName",
            "0c1e": "senderAddressType",
            "0c1f": "senderEmail",
            "5d01": "senderSmtpAddress",
            "5d02": "sentRepresentingSmtpAddress",
            "5d0a": "creatorSMTPAddress",
            "5d0b": "lastModifierSMTPAddress",
            "1000": "body",
            "007d": "headers",
            "1009": "compressedRtf",
            "3ffa": "lastModifierName",
            "0039": "clientSubmitTime",
            "0e06": "messageDeliveryTime",
            "3fde": "internetCodepage",
            "3ffd": "messageCodepage",
            "3ff1": "messageLocaleId",
            "0e07": "messageFlags",
            "1035": "messageId",
            "3fd9": "preview",
            // attachment specific
            "3007": "creationTime",
            "3008": "lastModificationTime",
            "3703": "extension",
            "3704": "fileNameShort",
            "3707": "fileName",
            "3712": "pidContentId",
            "7ffe": "attachmentHidden",
            "370e": "attachMimeTag",
            // recipient specific
            "0c15": "recipType",
            "3001": "name",
            "3002": "addressType",
            "3003": "email",
            "39fe": "smtpAddress",
            // contact specific
            "3a18": "departmentName",
            "3a44": "middleName",
            "3a05": "generation",
            "3a11": "surname",
            "3a27": "addressCity",
            "3a16": "companyName",
            "3a24": "businessFaxNumber",
            "3a29": "streetAddress",
            "3a51": "businessHomePage",
            "3a06": "givenName",
            "3a09": "homeTelephoneNumber",
            "3a15": "postalAddress",
            "3a17": "title",
            "3a1c": "mobileTelephoneNumber",
            "3a26": "country",
            "3a28": "stateOrProvince",
            "3a2a": "postalCode",
            "3a45": "displayNamePrefix",
            "0070": "conversationTopic",
            "0e1d": "normalizedSubject",
            "3a08": "businessTelephoneNumber",
            "3a0d": "location"
          },
          FULL_NAME_MAPPING: {
            "1013001f": "bodyHtml",
            "10130102": "html"
          },
          PIDLID_MAPPING: {
            // PSETID_Common
            "00062008-0000-0000-c000-000000000046": {
              34080: { id: "PidLidVerbStream" },
              34084: { id: "PidLidVerbResponse", dispid: "votingResponse" },
              34176: { id: "PidLidInternetAccountName", dispid: "inetAcctName" }
            },
            // PSETID_Appointment
            "00062002-0000-0000-c000-000000000046": {
              33293: { id: "PidLidAppointmentStartWhole", dispid: "apptStartWhole" },
              33294: { id: "PidLidAppointmentEndWhole", dispid: "apptEndWhole" },
              33333: { id: "PidLidClipStart", dispid: "clipStart" },
              33334: { id: "PidLidClipEnd", dispid: "clipEnd" },
              33331: { id: "PidLidTimeZoneStruct", dispid: "timeZoneStruct" },
              33332: { id: "PidLidTimeZoneDescription", dispid: "timeZoneDesc" },
              33374: { id: "PidLidAppointmentTimeZoneDefinitionStartDisplay", dispid: "apptTZDefStartDisplay" },
              33375: { id: "PidLidAppointmentTimeZoneDefinitionEndDisplay", dispid: "apptTZDefEndDisplay" },
              33376: { id: "PidLidAppointmentTimeZoneDefinitionRecur", dispid: "apptTZDefRecur" },
              33302: { id: "PidLidAppointmentRecur", dispid: "apptRecur" },
              33288: { id: "PidLidLocation", dispid: "apptLocation" }
            },
            // PSETID_Address
            "00062004-0000-0000-c000-000000000046": {
              32812: { id: "dispidYomiFirstName", dispid: "yomiFirstName" },
              32899: { id: "dispidEmail1EmailAddress", dispid: "email1EmailAddress" },
              32814: { id: "dispidYomiCompanyName", dispid: "yomiCompanyName" },
              32978: { id: "PidLidFax3AddressType", dispid: "fax3AddrType" },
              32896: { id: "PidLidEmail1DisplayName", dispid: "email1DisplayName" },
              32900: { id: "PidLidEmail1OriginalDisplayName", dispid: "email1OriginalDisplayName" },
              32773: { id: "PidLidFileUnder", dispid: "fileUnder" },
              32813: { id: "PidLidYomiLastName", dispid: "yomiLastName" },
              32946: { id: "PidLidFax1AddressType", dispid: "fax1AddrType" },
              32963: { id: "PidLidFax2EmailAddress", dispid: "fax2EmailAddress" },
              32838: { id: "PidLidWorkAddressCity", dispid: "workAddressCity" },
              32989: { id: "PidLidAddressCountryCode", dispid: "addressCountryCode" },
              32962: { id: "PidLidFax2AddressType", dispid: "fax2AddrType" },
              32964: { id: "PidLidFax2OriginalDisplayName", dispid: "fax2OriginalDisplayName" },
              32840: { id: "PidLidWorkAddressPostalCode", dispid: "workAddressPostalCode" },
              32837: { id: "PidLidWorkAddressStreet", dispid: "workAddressStreet" },
              32839: { id: "PidLidWorkAddressState", dispid: "workAddressState" },
              32987: { id: "PidLidWorkAddressCountryCode", dispid: "workAddressCountryCode" },
              32841: { id: "PidLidWorkAddressCountry", dispid: "workAddressCountry" },
              32811: { id: "PidLidHtml", dispid: "contactHtml" },
              32795: { id: "PidLidWorkAddress", dispid: "workAddress" },
              32948: { id: "PidLidFax1OriginalDisplayName", dispid: "fax1OriginalDisplayName" },
              32866: { id: "PidLidInstantMessagingAddress", dispid: "instMsg" },
              32784: { id: "PidLidDepartment", dispid: "department" },
              32947: { id: "PidLidFax1EmailAddress", dispid: "fax1EmailAddress" },
              32980: { id: "PidLidFax3OriginalDisplayName", dispid: "fax3OriginalDisplayName" },
              32979: { id: "PidLidFax3EmailAddress", dispid: "fax3EmailAddress" }
            },
            // PSETID_Meeting
            "6ed8da90-450b-101b-98da-00aa003f1305": {
              3: { id: "PidLidGlobalObjectId", dispid: "globalAppointmentID" },
              40: { id: "PidLidOldLocation", dispid: "apptOldLocation" }
            }
          },
          CLASS_MAPPING: {
            ATTACHMENT_DATA: "3701"
          },
          TYPE_MAPPING: {
            "001e": "string",
            "001f": "unicode",
            "0040": "time",
            "0102": "binary",
            "0003": "integer",
            "000b": "boolean"
          },
          DIR_TYPE: {
            INNER_MSG: "000d"
          }
        }
      }
    };
  }
});

// src/codepage.js
function lcidToCodepage(lcid) {
  if (!lcid || typeof lcid !== "number") return null;
  const primary = lcid & 1023;
  switch (lcid) {
    case 1028:
    case 3076:
    case 5124:
      return 950;
    // zh-TW, zh-HK, zh-MO
    case 2052:
    case 4100:
      return 936;
    // zh-CN, zh-SG
    case 3098:
    case 7194:
    case 10266:
    case 8218:
      return 1251;
    // Serbian/Bosnian Cyrillic
    case 2115:
    case 2092:
      return 1251;
    // Uzbek, Azeri Cyrillic
    default:
      break;
  }
  if ([25, 34, 35, 2, 47, 63, 64, 68, 80, 109, 133, 40].includes(primary)) return 1251;
  if ([5, 14, 21, 24, 27, 36, 26, 28, 66].includes(primary)) return 1250;
  if (primary === 8) return 1253;
  if ([31, 44, 67].includes(primary)) return 1254;
  if (primary === 13) return 1255;
  if ([1, 41, 32, 140].includes(primary)) return 1256;
  if ([37, 38, 39].includes(primary)) return 1257;
  if (primary === 42) return 1258;
  if (primary === 30) return 874;
  if (primary === 17) return 932;
  if (primary === 18) return 949;
  if (primary === 4) return 936;
  return 1252;
}
function chooseAnsiCodepage({ messageCodepage, messageLocaleId, internetCodepage } = {}) {
  if (messageCodepage && codepageLabel(messageCodepage)) {
    return { codepage: messageCodepage, source: "PidTagMessageCodepage" };
  }
  const fromLcid = lcidToCodepage(messageLocaleId);
  if (fromLcid) return { codepage: fromLcid, source: "PidTagMessageLocaleId" };
  if (internetCodepage) {
    const cp = ANSI_CPS.has(internetCodepage) ? internetCodepage : Object.hasOwn(INTERNET_TO_ANSI, internetCodepage) ? INTERNET_TO_ANSI[internetCodepage] : null;
    if (cp) return { codepage: cp, source: "PidTagInternetCodepage" };
  }
  return { codepage: 1252, source: "default" };
}
function codepageLabel(cp) {
  return Object.hasOwn(CP_TO_LABEL, cp) ? CP_TO_LABEL[cp] : null;
}
function decodeSbcs(u8, table) {
  let s = "";
  for (let i = 0; i < u8.length; i++) {
    const b = u8[i];
    s += b < 128 ? String.fromCharCode(b) : table[b - 128];
  }
  return s;
}
function getDecoder(label) {
  let d = decoders.get(label);
  if (!d) {
    d = new TextDecoder(label, { fatal: false });
    decoders.set(label, d);
  }
  return d;
}
function resolveLabel(enc) {
  if (enc == null) return "windows-1252";
  if (typeof enc === "number") return codepageLabel(enc) || "windows-1252";
  const s = String(enc).trim().toLowerCase();
  if (SBCS_TABLES.has(s)) return s;
  if (s === "ibm437" || s === "ibm850") return `x-cp${s.slice(3)}`;
  const m = /^(?:cp|windows-?|x-cp|ms|ibm)?(\d{3,5})$/.exec(s);
  if (m) return codepageLabel(Number(m[1])) || "windows-1252";
  if (s === "ucs2" || s === "ucs-2" || s === "utf16le" || s === "utf-16le") return "utf-16le";
  if (s === "utf8") return "utf-8";
  if (s === "latin1" || s === "binary" || s === "ascii") return "windows-1252";
  try {
    getDecoder(s);
    return s;
  } catch {
    return "windows-1252";
  }
}
function decodeBytes(bytes, enc) {
  if (!bytes) return "";
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const label = resolveLabel(enc);
  if (SBCS_TABLES.has(label)) return decodeSbcs(u8, SBCS_TABLES.get(label));
  try {
    return getDecoder(label).decode(u8);
  } catch {
    return getDecoder("windows-1252").decode(u8);
  }
}
function charsetToCodepage(charset) {
  switch (charset) {
    case 0:
      return 1252;
    // ANSI
    case 1:
      return null;
    // DEFAULT: use the document default
    case 2:
      return null;
    // SYMBOL: not mapped; Symbol/Wingdings glyphs come out as their Latin byte values (known limit)
    case 77:
      return 1e4;
    // Mac Roman
    case 128:
      return 932;
    // Shift JIS
    case 129:
      return 949;
    // Hangul
    case 130:
      return 1361;
    // Johab (not in the Encoding Standard; falls back)
    case 134:
      return 936;
    // GB2312
    case 136:
      return 950;
    // Big5
    case 161:
      return 1253;
    // Greek
    case 162:
      return 1254;
    // Turkish
    case 163:
      return 1258;
    // Vietnamese
    case 177:
      return 1255;
    // Hebrew
    case 178:
      return 1256;
    // Arabic
    case 186:
      return 1257;
    // Baltic
    case 204:
      return 1251;
    // Russian
    case 222:
      return 874;
    // Thai
    case 238:
      return 1250;
    // Eastern European
    case 254:
      return 437;
    // PC 437
    case 255:
      return 850;
    // OEM
    default:
      return null;
  }
}
var CP_TO_LABEL, INTERNET_TO_ANSI, ANSI_CPS, SBCS_TABLES, decoders;
var init_codepage = __esm({
  "src/codepage.js"() {
    CP_TO_LABEL = {
      437: "x-cp437",
      // not in the Encoding Standard: decoded with SBCS_TABLES below
      708: "iso-8859-6",
      720: "x-cp720",
      850: "x-cp850",
      866: "ibm866",
      874: "windows-874",
      932: "shift_jis",
      936: "gbk",
      949: "euc-kr",
      950: "big5",
      1200: "utf-16le",
      1201: "utf-16be",
      1250: "windows-1250",
      1251: "windows-1251",
      1252: "windows-1252",
      1253: "windows-1253",
      1254: "windows-1254",
      1255: "windows-1255",
      1256: "windows-1256",
      1257: "windows-1257",
      1258: "windows-1258",
      1e4: "macintosh",
      10007: "x-mac-cyrillic",
      20127: "windows-1252",
      // US-ASCII; the Encoding Standard maps ASCII to windows-1252
      20866: "koi8-r",
      21866: "koi8-u",
      20932: "euc-jp",
      28591: "windows-1252",
      28592: "iso-8859-2",
      28593: "iso-8859-3",
      28594: "iso-8859-4",
      28595: "iso-8859-5",
      28596: "iso-8859-6",
      28597: "iso-8859-7",
      28598: "iso-8859-8",
      28599: "windows-1254",
      28603: "iso-8859-13",
      28605: "iso-8859-15",
      38598: "iso-8859-8-i",
      50220: "iso-2022-jp",
      50221: "iso-2022-jp",
      50222: "iso-2022-jp",
      51932: "euc-jp",
      51936: "gbk",
      51949: "euc-kr",
      54936: "gb18030",
      65001: "utf-8"
    };
    INTERNET_TO_ANSI = {
      50220: 932,
      50221: 932,
      50222: 932,
      51932: 932,
      20932: 932,
      51936: 936,
      52936: 936,
      54936: 936,
      51949: 949,
      20127: 1252,
      28591: 1252,
      28605: 1252,
      65001: 1252,
      1200: 1252,
      20866: 1251,
      21866: 1251,
      28595: 1251,
      28592: 1250,
      28597: 1253,
      28599: 1254,
      28598: 1255,
      38598: 1255,
      28596: 1256,
      28594: 1257,
      28603: 1257
    };
    ANSI_CPS = /* @__PURE__ */ new Set([874, 932, 936, 949, 950, 1250, 1251, 1252, 1253, 1254, 1255, 1256, 1257, 1258]);
    SBCS_TABLES = /* @__PURE__ */ new Map([
      ["x-cp437", "\xC7\xFC\xE9\xE2\xE4\xE0\xE5\xE7\xEA\xEB\xE8\xEF\xEE\xEC\xC4\xC5\xC9\xE6\xC6\xF4\xF6\xF2\xFB\xF9\xFF\xD6\xDC\xA2\xA3\xA5\u20A7\u0192\xE1\xED\xF3\xFA\xF1\xD1\xAA\xBA\xBF\u2310\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u03B1\xDF\u0393\u03C0\u03A3\u03C3\xB5\u03C4\u03A6\u0398\u03A9\u03B4\u221E\u03C6\u03B5\u2229\u2261\xB1\u2265\u2264\u2320\u2321\xF7\u2248\xB0\u2219\xB7\u221A\u207F\xB2\u25A0\xA0"],
      ["x-cp720", "\x80\x81\xE9\xE2\x84\xE0\x86\xE7\xEA\xEB\xE8\xEF\xEE\x8D\x8E\x8F\x90\u0651\u0652\xF4\xA4\u0640\xFB\xF9\u0621\u0622\u0623\u0624\xA3\u0625\u0626\u0627\u0628\u0629\u062A\u062B\u062C\u062D\u062E\u062F\u0630\u0631\u0632\u0633\u0634\u0635\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u0636\u0637\u0638\u0639\u063A\u0641\xB5\u0642\u0643\u0644\u0645\u0646\u0647\u0648\u0649\u064A\u2261\u064B\u064C\u064D\u064E\u064F\u0650\u2248\xB0\u2219\xB7\u221A\u207F\xB2\u25A0\xA0"],
      ["x-cp850", "\xC7\xFC\xE9\xE2\xE4\xE0\xE5\xE7\xEA\xEB\xE8\xEF\xEE\xEC\xC4\xC5\xC9\xE6\xC6\xF4\xF6\xF2\xFB\xF9\xFF\xD6\xDC\xF8\xA3\xD8\xD7\u0192\xE1\xED\xF3\xFA\xF1\xD1\xAA\xBA\xBF\xAE\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524\xC1\xC2\xC0\xA9\u2563\u2551\u2557\u255D\xA2\xA5\u2510\u2514\u2534\u252C\u251C\u2500\u253C\xE3\xC3\u255A\u2554\u2569\u2566\u2560\u2550\u256C\xA4\xF0\xD0\xCA\xCB\xC8\u0131\xCD\xCE\xCF\u2518\u250C\u2588\u2584\xA6\xCC\u2580\xD3\xDF\xD4\xD2\xF5\xD5\xB5\xFE\xDE\xDA\xDB\xD9\xFD\xDD\xAF\xB4\xAD\xB1\u2017\xBE\xB6\xA7\xF7\xB8\xB0\xA8\xB7\xB9\xB3\xB2\u25A0\xA0"]
    ]);
    decoders = /* @__PURE__ */ new Map();
  }
});

// src/iconv-shim.js
var iconv_shim_exports = {};
__export(iconv_shim_exports, {
  decode: () => decode,
  default: () => iconv_shim_default,
  encode: () => encode,
  encodingExists: () => encodingExists
});
function decode(bytes, encoding) {
  return decodeBytes(bytes, encoding);
}
function encode(str, encoding) {
  const enc = String(encoding || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (enc === "utf16le" || enc === "ucs2") {
    const out = new Uint8Array(str.length * 2);
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      out[i * 2] = c & 255;
      out[i * 2 + 1] = c >> 8;
    }
    return out;
  }
  if (enc === "utf8") return new TextEncoder().encode(str);
  if (enc === "ascii" || enc === "latin1" || enc === "binary") {
    const out = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) out[i] = str.charCodeAt(i) & 255;
    return out;
  }
  throw new Error(`iconv-shim: encoding to ${encoding} is not supported`);
}
function encodingExists() {
  return true;
}
var iconv_shim_default;
var init_iconv_shim = __esm({
  "src/iconv-shim.js"() {
    init_codepage();
    iconv_shim_default = { decode, encode, encodingExists };
  }
});

// node_modules/@kenjiuno/msgreader/lib/DataStream.js
var require_DataStream = __commonJS({
  "node_modules/@kenjiuno/msgreader/lib/DataStream.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var iconv = (init_iconv_shim(), __toCommonJS(iconv_shim_exports));
    var DataStream = (
      /** @class */
      (function() {
        function DataStream2(arrayBuffer, byteOffset, endianness) {
          this._dynamicSize = true;
          this._byteLength = 0;
          this.failurePosition = 0;
          this._byteOffset = byteOffset || 0;
          if (arrayBuffer instanceof ArrayBuffer) {
            this.buffer = arrayBuffer;
          } else if (arrayBuffer instanceof DataView) {
            this.dataView = arrayBuffer;
          } else if (arrayBuffer && arrayBuffer.buffer instanceof ArrayBuffer) {
            this._byteOffset += arrayBuffer.byteOffset;
            this._buffer = arrayBuffer.buffer;
            this._dataView = new DataView(this._buffer, this._byteOffset);
            this._byteLength = this._dataView.byteLength + this._byteOffset;
          } else {
            throw new Error("Unknown arrayBuffer");
          }
          this.position = 0;
          this.endianness = endianness == null ? DataStream2.LITTLE_ENDIAN : endianness;
        }
        ;
        DataStream2.prototype.save = function(filename) {
          var blob = new Blob([this.buffer]);
          var URL2 = window["webkitURL"] || window.URL;
          if (URL2 && URL2.createObjectURL) {
            var url = URL2.createObjectURL(blob);
            var a = document.createElement("a");
            a.setAttribute("href", url);
            a.setAttribute("download", filename);
            a.click();
            URL2.revokeObjectURL(url);
          } else {
            throw "DataStream.save: Can't create object URL.";
          }
        };
        ;
        Object.defineProperty(DataStream2.prototype, "dynamicSize", {
          /**
           * Whether to extend DataStream buffer when trying to write beyond its size.
           * If set, the buffer is reallocated to twice its current size until the
           * requested write fits the buffer.
           */
          get: function() {
            return this._dynamicSize;
          },
          set: function(v) {
            if (!v) {
              this._trimAlloc();
            }
            this._dynamicSize = v;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(DataStream2.prototype, "byteLength", {
          /**
            Returns the byte length of the DataStream object.
            */
          get: function() {
            return this._byteLength - this._byteOffset;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(DataStream2.prototype, "buffer", {
          /**
            Set/get the backing ArrayBuffer of the DataStream object.
            The setter updates the DataView to point to the new buffer.
            */
          get: function() {
            this._trimAlloc();
            return this._buffer;
          },
          set: function(v) {
            this._buffer = v;
            this._dataView = new DataView(this._buffer, this._byteOffset);
            this._byteLength = this._buffer.byteLength;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(DataStream2.prototype, "byteOffset", {
          /**
            Set/get the byteOffset of the DataStream object.
            The setter updates the DataView to point to the new byteOffset.
            */
          get: function() {
            return this._byteOffset;
          },
          set: function(v) {
            this._byteOffset = v;
            this._dataView = new DataView(this._buffer, this._byteOffset);
            this._byteLength = this._buffer.byteLength;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(DataStream2.prototype, "dataView", {
          /**
            Set/get the backing DataView of the DataStream object.
            The setter updates the buffer and byteOffset to point to the DataView values.
            */
          get: function() {
            return this._dataView;
          },
          set: function(v) {
            this._byteOffset = v.byteOffset;
            this._buffer = v.buffer;
            this._dataView = new DataView(this._buffer, this._byteOffset);
            this._byteLength = this._byteOffset + v.byteLength;
          },
          enumerable: false,
          configurable: true
        });
        DataStream2.prototype._realloc = function(extra) {
          if (!this._dynamicSize) {
            return;
          }
          var req = this._byteOffset + this.position + extra;
          var blen = this._buffer.byteLength;
          if (req <= blen) {
            if (req > this._byteLength) {
              this._byteLength = req;
            }
            return;
          }
          if (blen < 1) {
            blen = 1;
          }
          while (req > blen) {
            blen *= 2;
          }
          var buf = new ArrayBuffer(blen);
          var src = new Uint8Array(this._buffer);
          var dst = new Uint8Array(buf, 0, src.length);
          dst.set(src);
          this.buffer = buf;
          this._byteLength = req;
        };
        ;
        DataStream2.prototype._trimAlloc = function() {
          if (this._byteLength == this._buffer.byteLength) {
            return;
          }
          var buf = new ArrayBuffer(this._byteLength);
          var dst = new Uint8Array(buf);
          var src = new Uint8Array(this._buffer, 0, dst.length);
          dst.set(src);
          this.buffer = buf;
        };
        ;
        DataStream2.prototype.seek = function(pos) {
          var npos = Math.max(0, Math.min(this.byteLength, pos));
          this.position = isNaN(npos) || !isFinite(npos) ? 0 : npos;
        };
        ;
        DataStream2.prototype.isEof = function() {
          return this.position >= this.byteLength;
        };
        ;
        DataStream2.prototype.mapInt32Array = function(length, e) {
          this._realloc(length * 4);
          var arr = new Int32Array(this._buffer, this.byteOffset + this.position, length);
          DataStream2.arrayToNative(arr, e == null ? this.endianness : e);
          this.position += length * 4;
          return arr;
        };
        ;
        DataStream2.prototype.mapInt16Array = function(length, e) {
          this._realloc(length * 2);
          var arr = new Int16Array(this._buffer, this.byteOffset + this.position, length);
          DataStream2.arrayToNative(arr, e == null ? this.endianness : e);
          this.position += length * 2;
          return arr;
        };
        ;
        DataStream2.prototype.mapInt8Array = function(length) {
          this._realloc(length * 1);
          var arr = new Int8Array(this._buffer, this.byteOffset + this.position, length);
          this.position += length * 1;
          return arr;
        };
        ;
        DataStream2.prototype.mapUint32Array = function(length, e) {
          this._realloc(length * 4);
          var arr = new Uint32Array(this._buffer, this.byteOffset + this.position, length);
          DataStream2.arrayToNative(arr, e == null ? this.endianness : e);
          this.position += length * 4;
          return arr;
        };
        ;
        DataStream2.prototype.mapUint16Array = function(length, e) {
          this._realloc(length * 2);
          var arr = new Uint16Array(this._buffer, this.byteOffset + this.position, length);
          DataStream2.arrayToNative(arr, e == null ? this.endianness : e);
          this.position += length * 2;
          return arr;
        };
        ;
        DataStream2.prototype.mapUint8Array = function(length) {
          this._realloc(length * 1);
          var arr = new Uint8Array(this._buffer, this.byteOffset + this.position, length);
          this.position += length * 1;
          return arr;
        };
        ;
        DataStream2.prototype.mapFloat64Array = function(length, e) {
          this._realloc(length * 8);
          var arr = new Float64Array(this._buffer, this.byteOffset + this.position, length);
          DataStream2.arrayToNative(arr, e == null ? this.endianness : e);
          this.position += length * 8;
          return arr;
        };
        ;
        DataStream2.prototype.mapFloat32Array = function(length, e) {
          this._realloc(length * 4);
          var arr = new Float32Array(this._buffer, this.byteOffset + this.position, length);
          DataStream2.arrayToNative(arr, e == null ? this.endianness : e);
          this.position += length * 4;
          return arr;
        };
        ;
        DataStream2.prototype.readInt32Array = function(length, e) {
          length = length == null ? (this.byteLength - this.position) / 4 : length;
          var arr = new Int32Array(length);
          DataStream2.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
          DataStream2.arrayToNative(arr, e == null ? this.endianness : e);
          this.position += arr.byteLength;
          return arr;
        };
        ;
        DataStream2.prototype.readInt16Array = function(length, e) {
          length = length == null ? (this.byteLength - this.position) / 2 : length;
          var arr = new Int16Array(length);
          DataStream2.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
          DataStream2.arrayToNative(arr, e == null ? this.endianness : e);
          this.position += arr.byteLength;
          return arr;
        };
        ;
        DataStream2.prototype.readInt8Array = function(length) {
          length = length == null ? this.byteLength - this.position : length;
          var arr = new Int8Array(length);
          DataStream2.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
          this.position += arr.byteLength;
          return arr;
        };
        ;
        DataStream2.prototype.readUint32Array = function(length, e) {
          length = length == null ? (this.byteLength - this.position) / 4 : length;
          var arr = new Uint32Array(length);
          DataStream2.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
          DataStream2.arrayToNative(arr, e == null ? this.endianness : e);
          this.position += arr.byteLength;
          return arr;
        };
        ;
        DataStream2.prototype.readUint16Array = function(length, e) {
          length = length == null ? (this.byteLength - this.position) / 2 : length;
          var arr = new Uint16Array(length);
          DataStream2.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
          DataStream2.arrayToNative(arr, e == null ? this.endianness : e);
          this.position += arr.byteLength;
          return arr;
        };
        ;
        DataStream2.prototype.readUint8Array = function(length) {
          length = length == null ? this.byteLength - this.position : length;
          var arr = new Uint8Array(length);
          DataStream2.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
          this.position += arr.byteLength;
          return arr;
        };
        ;
        DataStream2.prototype.readToUint8Array = function(length, arr, dstOffset) {
          length = length == null ? this.byteLength - this.position : length;
          DataStream2.memcpy(arr.buffer, dstOffset, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
          this.position += arr.byteLength;
        };
        ;
        DataStream2.prototype.readFloat64Array = function(length, e) {
          length = length == null ? (this.byteLength - this.position) / 8 : length;
          var arr = new Float64Array(length);
          DataStream2.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
          DataStream2.arrayToNative(arr, e == null ? this.endianness : e);
          this.position += arr.byteLength;
          return arr;
        };
        ;
        DataStream2.prototype.readFloat32Array = function(length, e) {
          length = length == null ? (this.byteLength - this.position) / 4 : length;
          var arr = new Float32Array(length);
          DataStream2.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
          DataStream2.arrayToNative(arr, e == null ? this.endianness : e);
          this.position += arr.byteLength;
          return arr;
        };
        ;
        DataStream2.prototype.writeInt32Array = function(arr, e) {
          this._realloc(arr.length * 4);
          if (arr instanceof Int32Array && this.byteOffset + this.position % arr.BYTES_PER_ELEMENT == 0) {
            DataStream2.memcpy(this._buffer, this.byteOffset + this.position, arr.buffer, 0, arr.byteLength);
            this.mapInt32Array(arr.length, e);
          } else {
            for (var i = 0; i < arr.length; i++) {
              this.writeInt32(arr[i], e);
            }
          }
        };
        ;
        DataStream2.prototype.writeInt16Array = function(arr, e) {
          this._realloc(arr.length * 2);
          if (arr instanceof Int16Array && this.byteOffset + this.position % arr.BYTES_PER_ELEMENT == 0) {
            DataStream2.memcpy(this._buffer, this.byteOffset + this.position, arr.buffer, 0, arr.byteLength);
            this.mapInt16Array(arr.length, e);
          } else {
            for (var i = 0; i < arr.length; i++) {
              this.writeInt16(arr[i], e);
            }
          }
        };
        ;
        DataStream2.prototype.writeInt8Array = function(arr) {
          this._realloc(arr.length * 1);
          if (arr instanceof Int8Array && this.byteOffset + this.position % arr.BYTES_PER_ELEMENT == 0) {
            DataStream2.memcpy(this._buffer, this.byteOffset + this.position, arr.buffer, 0, arr.byteLength);
            this.mapInt8Array(arr.length);
          } else {
            for (var i = 0; i < arr.length; i++) {
              this.writeInt8(arr[i]);
            }
          }
        };
        ;
        DataStream2.prototype.writeUint32Array = function(arr, e) {
          this._realloc(arr.length * 4);
          if (arr instanceof Uint32Array && this.byteOffset + this.position % arr.BYTES_PER_ELEMENT == 0) {
            DataStream2.memcpy(this._buffer, this.byteOffset + this.position, arr.buffer, 0, arr.byteLength);
            this.mapUint32Array(arr.length, e);
          } else {
            for (var i = 0; i < arr.length; i++) {
              this.writeUint32(arr[i], e);
            }
          }
        };
        ;
        DataStream2.prototype.writeUint16Array = function(arr, e) {
          this._realloc(arr.length * 2);
          if (arr instanceof Uint16Array && this.byteOffset + this.position % arr.BYTES_PER_ELEMENT == 0) {
            DataStream2.memcpy(this._buffer, this.byteOffset + this.position, arr.buffer, 0, arr.byteLength);
            this.mapUint16Array(arr.length, e);
          } else {
            for (var i = 0; i < arr.length; i++) {
              this.writeUint16(arr[i], e);
            }
          }
        };
        ;
        DataStream2.prototype.writeUint8Array = function(arr) {
          this._realloc(arr.length * 1);
          if (arr instanceof Uint8Array && this.byteOffset + this.position % arr.BYTES_PER_ELEMENT == 0) {
            DataStream2.memcpy(this._buffer, this.byteOffset + this.position, arr.buffer, 0, arr.byteLength);
            this.mapUint8Array(arr.length);
          } else {
            for (var i = 0; i < arr.length; i++) {
              this.writeUint8(arr[i]);
            }
          }
        };
        ;
        DataStream2.prototype.writeFloat64Array = function(arr, e) {
          this._realloc(arr.length * 8);
          if (arr instanceof Float64Array && this.byteOffset + this.position % arr.BYTES_PER_ELEMENT == 0) {
            DataStream2.memcpy(this._buffer, this.byteOffset + this.position, arr.buffer, 0, arr.byteLength);
            this.mapFloat64Array(arr.length, e);
          } else {
            for (var i = 0; i < arr.length; i++) {
              this.writeFloat64(arr[i], e);
            }
          }
        };
        ;
        DataStream2.prototype.writeFloat32Array = function(arr, e) {
          this._realloc(arr.length * 4);
          if (arr instanceof Float32Array && this.byteOffset + this.position % arr.BYTES_PER_ELEMENT == 0) {
            DataStream2.memcpy(this._buffer, this.byteOffset + this.position, arr.buffer, 0, arr.byteLength);
            this.mapFloat32Array(arr.length, e);
          } else {
            for (var i = 0; i < arr.length; i++) {
              this.writeFloat32(arr[i], e);
            }
          }
        };
        ;
        DataStream2.prototype.readInt32 = function(e) {
          var v = this._dataView.getInt32(this.position, e == null ? this.endianness : e);
          this.position += 4;
          return v;
        };
        ;
        DataStream2.prototype.readInt = function(offset) {
          this.seek(offset);
          return this.readInt32();
        };
        ;
        DataStream2.prototype.readInt16 = function(e) {
          var v = this._dataView.getInt16(this.position, e == null ? this.endianness : e);
          this.position += 2;
          return v;
        };
        ;
        DataStream2.prototype.readShort = function(offset) {
          this.seek(offset);
          return this.readInt16();
        };
        ;
        DataStream2.prototype.readInt8 = function() {
          var v = this._dataView.getInt8(this.position);
          this.position += 1;
          return v;
        };
        ;
        DataStream2.prototype.readByte = function(offset) {
          this.seek(offset);
          return this.readInt8();
        };
        ;
        DataStream2.prototype.readUint32 = function(e) {
          var v = this._dataView.getUint32(this.position, e == null ? this.endianness : e);
          this.position += 4;
          return v;
        };
        ;
        DataStream2.prototype.readUint16 = function(e) {
          var v = this._dataView.getUint16(this.position, e == null ? this.endianness : e);
          this.position += 2;
          return v;
        };
        ;
        DataStream2.prototype.readUint8 = function() {
          var v = this._dataView.getUint8(this.position);
          this.position += 1;
          return v;
        };
        ;
        DataStream2.prototype.readFloat32 = function(e) {
          var v = this._dataView.getFloat32(this.position, e == null ? this.endianness : e);
          this.position += 4;
          return v;
        };
        ;
        DataStream2.prototype.readFloat64 = function(e) {
          var v = this._dataView.getFloat64(this.position, e == null ? this.endianness : e);
          this.position += 8;
          return v;
        };
        ;
        DataStream2.prototype.writeInt32 = function(v, e) {
          this._realloc(4);
          this._dataView.setInt32(this.position, v, e == null ? this.endianness : e);
          this.position += 4;
        };
        ;
        DataStream2.prototype.writeInt16 = function(v, e) {
          this._realloc(2);
          this._dataView.setInt16(this.position, v, e == null ? this.endianness : e);
          this.position += 2;
        };
        ;
        DataStream2.prototype.writeInt8 = function(v) {
          this._realloc(1);
          this._dataView.setInt8(this.position, v);
          this.position += 1;
        };
        ;
        DataStream2.prototype.writeUint32 = function(v, e) {
          this._realloc(4);
          this._dataView.setUint32(this.position, v, e == null ? this.endianness : e);
          this.position += 4;
        };
        ;
        DataStream2.prototype.writeUint16 = function(v, e) {
          this._realloc(2);
          this._dataView.setUint16(this.position, v, e == null ? this.endianness : e);
          this.position += 2;
        };
        ;
        DataStream2.prototype.writeUint8 = function(v) {
          this._realloc(1);
          this._dataView.setUint8(this.position, v);
          this.position += 1;
        };
        ;
        DataStream2.prototype.writeFloat32 = function(v, e) {
          this._realloc(4);
          this._dataView.setFloat32(this.position, v, e == null ? this.endianness : e);
          this.position += 4;
        };
        ;
        DataStream2.prototype.writeFloat64 = function(v, e) {
          this._realloc(8);
          this._dataView.setFloat64(this.position, v, e == null ? this.endianness : e);
          this.position += 8;
        };
        ;
        DataStream2.memcpy = function(dst, dstOffset, src, srcOffset, byteLength) {
          var dstU8 = new Uint8Array(dst, dstOffset, byteLength);
          var srcU8 = new Uint8Array(src, srcOffset, byteLength);
          dstU8.set(srcU8);
        };
        ;
        DataStream2.arrayToNative = function(array, arrayIsLittleEndian) {
          if (arrayIsLittleEndian == this.endianness) {
            return array;
          } else {
            return this.flipArrayEndianness(array);
          }
        };
        ;
        DataStream2.nativeToEndian = function(array, littleEndian) {
          if (this.endianness == littleEndian) {
            return array;
          } else {
            return this.flipArrayEndianness(array);
          }
        };
        ;
        DataStream2.flipArrayEndianness = function(array) {
          var u8 = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
          for (var i = 0; i < array.byteLength; i += array.BYTES_PER_ELEMENT) {
            for (var j = i + array.BYTES_PER_ELEMENT - 1, k = i; j > k; j--, k++) {
              var tmp = u8[k];
              u8[k] = u8[j];
              u8[j] = tmp;
            }
          }
          return array;
        };
        ;
        DataStream2.createStringFromArray = function(array) {
          var str = "";
          for (var i = 0; i < array.length; i++) {
            str += String.fromCharCode(array[i]);
          }
          return str;
        };
        ;
        DataStream2.prototype.readStruct = function(structDefinition) {
          var struct = {}, t, v, n;
          var p = this.position;
          for (var i = 0; i < structDefinition.length; i += 2) {
            t = structDefinition[i + 1];
            v = this.readType(t, struct);
            if (v == null) {
              if (this.failurePosition == 0) {
                this.failurePosition = this.position;
              }
              this.position = p;
              return null;
            }
            struct[structDefinition[i]] = v;
          }
          return struct;
        };
        ;
        DataStream2.prototype.readUCS2String = function(length, endianness) {
          return DataStream2.createStringFromArray(this.readUint16Array(length, endianness));
        };
        ;
        DataStream2.prototype.readStringAt = function(offset, length) {
          this.seek(offset);
          return this.readUCS2String(length);
        };
        ;
        DataStream2.prototype.writeUCS2String = function(str, endianness, lengthOverride) {
          if (lengthOverride == null) {
            lengthOverride = str.length;
          }
          for (var i = 0; i < str.length && i < lengthOverride; i++) {
            this.writeUint16(str.charCodeAt(i), endianness);
          }
          for (; i < lengthOverride; i++) {
            this.writeUint16(0, endianness);
          }
        };
        ;
        DataStream2.prototype.readString = function(length, encoding) {
          if (encoding == null || encoding == "ASCII") {
            return DataStream2.createStringFromArray(this.mapUint8Array(length == null ? this.byteLength - this.position : length));
          } else {
            return iconv.decode(this.mapUint8Array(length), encoding);
          }
        };
        ;
        DataStream2.prototype.writeString = function(s, encoding, length) {
          if (encoding == null || encoding == "ASCII") {
            if (length != null) {
              var i = 0;
              var len = Math.min(s.length, length);
              for (i = 0; i < len; i++) {
                this.writeUint8(s.charCodeAt(i));
              }
              for (; i < length; i++) {
                this.writeUint8(0);
              }
            } else {
              for (var i = 0; i < s.length; i++) {
                this.writeUint8(s.charCodeAt(i));
              }
            }
          } else {
            this.writeUint8Array(iconv.encode(s.substring(0, length), encoding));
          }
        };
        ;
        DataStream2.prototype.readCString = function(length) {
          var blen = this.byteLength - this.position;
          var u8 = new Uint8Array(this._buffer, this._byteOffset + this.position);
          var len = blen;
          if (length != null) {
            len = Math.min(length, blen);
          }
          for (var i = 0; i < len && u8[i] != 0; i++)
            ;
          var s = DataStream2.createStringFromArray(this.mapUint8Array(i));
          if (length != null) {
            this.position += len - i;
          } else if (i != blen) {
            this.position += 1;
          }
          return s;
        };
        ;
        DataStream2.prototype.writeCString = function(s, length) {
          if (length != null) {
            var i = 0;
            var len = Math.min(s.length, length);
            for (i = 0; i < len; i++) {
              this.writeUint8(s.charCodeAt(i));
            }
            for (; i < length; i++) {
              this.writeUint8(0);
            }
          } else {
            for (var i = 0; i < s.length; i++) {
              this.writeUint8(s.charCodeAt(i));
            }
            this.writeUint8(0);
          }
        };
        ;
        DataStream2.prototype.readType = function(t, struct) {
          if (typeof t == "function") {
            return t(this, struct);
          } else if (typeof t == "object" && !(t instanceof Array)) {
            return t.get(this, struct);
          } else if (t instanceof Array && t.length != 3) {
            return this.readStruct(t);
          }
          var v = null;
          var lengthOverride = null;
          var charset = "ASCII";
          var pos = this.position;
          var len;
          if (typeof t == "string" && /:/.test(t)) {
            var tp = t.split(":");
            t = tp[0];
            len = tp[1];
            if (struct[len] != null) {
              lengthOverride = parseInt(struct[len]);
            } else {
              lengthOverride = parseInt(tp[1]);
            }
          }
          if (typeof t == "string" && /,/.test(t)) {
            var tp = t.split(",");
            t = tp[0];
            charset = parseInt(tp[1]).toString();
          }
          switch (t) {
            case "uint8":
              v = this.readUint8();
              break;
            case "int8":
              v = this.readInt8();
              break;
            case "uint16":
              v = this.readUint16(this.endianness);
              break;
            case "int16":
              v = this.readInt16(this.endianness);
              break;
            case "uint32":
              v = this.readUint32(this.endianness);
              break;
            case "int32":
              v = this.readInt32(this.endianness);
              break;
            case "float32":
              v = this.readFloat32(this.endianness);
              break;
            case "float64":
              v = this.readFloat64(this.endianness);
              break;
            case "uint16be":
              v = this.readUint16(DataStream2.BIG_ENDIAN);
              break;
            case "int16be":
              v = this.readInt16(DataStream2.BIG_ENDIAN);
              break;
            case "uint32be":
              v = this.readUint32(DataStream2.BIG_ENDIAN);
              break;
            case "int32be":
              v = this.readInt32(DataStream2.BIG_ENDIAN);
              break;
            case "float32be":
              v = this.readFloat32(DataStream2.BIG_ENDIAN);
              break;
            case "float64be":
              v = this.readFloat64(DataStream2.BIG_ENDIAN);
              break;
            case "uint16le":
              v = this.readUint16(DataStream2.LITTLE_ENDIAN);
              break;
            case "int16le":
              v = this.readInt16(DataStream2.LITTLE_ENDIAN);
              break;
            case "uint32le":
              v = this.readUint32(DataStream2.LITTLE_ENDIAN);
              break;
            case "int32le":
              v = this.readInt32(DataStream2.LITTLE_ENDIAN);
              break;
            case "float32le":
              v = this.readFloat32(DataStream2.LITTLE_ENDIAN);
              break;
            case "float64le":
              v = this.readFloat64(DataStream2.LITTLE_ENDIAN);
              break;
            case "cstring":
              v = this.readCString(lengthOverride);
              break;
            case "string":
              v = this.readString(lengthOverride, charset);
              break;
            case "u16string":
              v = this.readUCS2String(lengthOverride, this.endianness);
              break;
            case "u16stringle":
              v = this.readUCS2String(lengthOverride, DataStream2.LITTLE_ENDIAN);
              break;
            case "u16stringbe":
              v = this.readUCS2String(lengthOverride, DataStream2.BIG_ENDIAN);
              break;
            default:
              if (t.length == 3) {
                var ta = t[1];
                var len = t[2];
                var length = 0;
                if (typeof len == "function") {
                  length = len(struct, this, t);
                } else if (typeof len == "string" && struct[len] != null) {
                  length = parseInt(struct[len]);
                } else {
                  length = parseInt(len);
                }
                if (typeof ta == "string") {
                  var tap = ta.replace(/(le|be)$/, "");
                  var endianness = null;
                  if (/le$/.test(ta)) {
                    endianness = DataStream2.LITTLE_ENDIAN;
                  } else if (/be$/.test(ta)) {
                    endianness = DataStream2.BIG_ENDIAN;
                  }
                  if (len == "*") {
                    length = null;
                  }
                  switch (tap) {
                    case "uint8":
                      v = this.readUint8Array(length);
                      break;
                    case "uint16":
                      v = this.readUint16Array(length, endianness);
                      break;
                    case "uint32":
                      v = this.readUint32Array(length, endianness);
                      break;
                    case "int8":
                      v = this.readInt8Array(length);
                      break;
                    case "int16":
                      v = this.readInt16Array(length, endianness);
                      break;
                    case "int32":
                      v = this.readInt32Array(length, endianness);
                      break;
                    case "float32":
                      v = this.readFloat32Array(length, endianness);
                      break;
                    case "float64":
                      v = this.readFloat64Array(length, endianness);
                      break;
                    case "cstring":
                    case "utf16string":
                    case "string":
                      if (length == null) {
                        v = [];
                        while (!this.isEof()) {
                          var u = this.readType(ta, struct);
                          if (u == null)
                            break;
                          v.push(u);
                        }
                      } else {
                        v = new Array(length);
                        for (var i = 0; i < length; i++) {
                          v[i] = this.readType(ta, struct);
                        }
                      }
                      break;
                  }
                } else {
                  if (len == "*") {
                    v = [];
                    this.buffer;
                    while (true) {
                      var p = this.position;
                      try {
                        var o = this.readType(ta, struct);
                        if (o == null) {
                          this.position = p;
                          break;
                        }
                        v.push(o);
                      } catch (e) {
                        this.position = p;
                        break;
                      }
                    }
                  } else {
                    v = new Array(length);
                    for (var i = 0; i < length; i++) {
                      var u = this.readType(ta, struct);
                      if (u == null)
                        return null;
                      v[i] = u;
                    }
                  }
                }
                break;
              }
          }
          if (lengthOverride != null) {
            this.position = pos + lengthOverride;
          }
          return v;
        };
        ;
        DataStream2.prototype.writeStruct = function(structDefinition, struct) {
          for (var i = 0; i < structDefinition.length; i += 2) {
            var t = structDefinition[i + 1];
            this.writeType(t, struct[structDefinition[i]], struct);
          }
        };
        ;
        DataStream2.prototype.writeType = function(t, v, struct) {
          if (typeof t == "function") {
            return t(this, v);
          } else if (typeof t == "object" && !(t instanceof Array)) {
            return t.set(this, v, struct);
          }
          var lengthOverride = null;
          var charset = "ASCII";
          var pos = this.position;
          if (typeof t == "string" && /:/.test(t)) {
            var tp = t.split(":");
            t = tp[0];
            lengthOverride = parseInt(tp[1]);
          }
          if (typeof t == "string" && /,/.test(t)) {
            var tp = t.split(",");
            t = tp[0];
            charset = parseInt(tp[1]).toString();
          }
          switch (t) {
            case "uint8":
              this.writeUint8(v);
              break;
            case "int8":
              this.writeInt8(v);
              break;
            case "uint16":
              this.writeUint16(v, this.endianness);
              break;
            case "int16":
              this.writeInt16(v, this.endianness);
              break;
            case "uint32":
              this.writeUint32(v, this.endianness);
              break;
            case "int32":
              this.writeInt32(v, this.endianness);
              break;
            case "float32":
              this.writeFloat32(v, this.endianness);
              break;
            case "float64":
              this.writeFloat64(v, this.endianness);
              break;
            case "uint16be":
              this.writeUint16(v, DataStream2.BIG_ENDIAN);
              break;
            case "int16be":
              this.writeInt16(v, DataStream2.BIG_ENDIAN);
              break;
            case "uint32be":
              this.writeUint32(v, DataStream2.BIG_ENDIAN);
              break;
            case "int32be":
              this.writeInt32(v, DataStream2.BIG_ENDIAN);
              break;
            case "float32be":
              this.writeFloat32(v, DataStream2.BIG_ENDIAN);
              break;
            case "float64be":
              this.writeFloat64(v, DataStream2.BIG_ENDIAN);
              break;
            case "uint16le":
              this.writeUint16(v, DataStream2.LITTLE_ENDIAN);
              break;
            case "int16le":
              this.writeInt16(v, DataStream2.LITTLE_ENDIAN);
              break;
            case "uint32le":
              this.writeUint32(v, DataStream2.LITTLE_ENDIAN);
              break;
            case "int32le":
              this.writeInt32(v, DataStream2.LITTLE_ENDIAN);
              break;
            case "float32le":
              this.writeFloat32(v, DataStream2.LITTLE_ENDIAN);
              break;
            case "float64le":
              this.writeFloat64(v, DataStream2.LITTLE_ENDIAN);
              break;
            case "cstring":
              this.writeCString(v, lengthOverride);
              break;
            case "string":
              this.writeString(v, charset, lengthOverride);
              break;
            case "u16string":
              this.writeUCS2String(v, this.endianness, lengthOverride);
              break;
            case "u16stringle":
              this.writeUCS2String(v, DataStream2.LITTLE_ENDIAN, lengthOverride);
              break;
            case "u16stringbe":
              this.writeUCS2String(v, DataStream2.BIG_ENDIAN, lengthOverride);
              break;
            default:
              if (t.length == 3) {
                var ta = t[1];
                for (var i = 0; i < v.length; i++) {
                  this.writeType(ta, v[i], t[2]);
                }
                break;
              } else {
                this.writeStruct(t, v);
                break;
              }
          }
          if (lengthOverride != null) {
            this.position = pos;
            this._realloc(lengthOverride);
            this.position = pos + lengthOverride;
          }
        };
        ;
        DataStream2.BIG_ENDIAN = false;
        DataStream2.LITTLE_ENDIAN = true;
        DataStream2.endianness = new Int8Array(new Int16Array([1]).buffer)[0] > 0;
        return DataStream2;
      })()
    );
    exports.default = DataStream;
    if (Uint8Array.prototype.BYTES_PER_ELEMENT === void 0) {
      Object.defineProperties(Uint8Array.prototype, { BYTES_PER_ELEMENT: { value: Uint8Array.BYTES_PER_ELEMENT } });
      Object.defineProperties(Int8Array.prototype, { BYTES_PER_ELEMENT: { value: Int8Array.BYTES_PER_ELEMENT } });
      Object.defineProperties(Uint8ClampedArray.prototype, { BYTES_PER_ELEMENT: { value: Uint8ClampedArray.BYTES_PER_ELEMENT } });
      Object.defineProperties(Uint16Array.prototype, { BYTES_PER_ELEMENT: { value: Uint16Array.BYTES_PER_ELEMENT } });
      Object.defineProperties(Int16Array.prototype, { BYTES_PER_ELEMENT: { value: Int16Array.BYTES_PER_ELEMENT } });
      Object.defineProperties(Uint32Array.prototype, { BYTES_PER_ELEMENT: { value: Uint32Array.BYTES_PER_ELEMENT } });
      Object.defineProperties(Int32Array.prototype, { BYTES_PER_ELEMENT: { value: Int32Array.BYTES_PER_ELEMENT } });
      Object.defineProperties(Float64Array.prototype, { BYTES_PER_ELEMENT: { value: Float64Array.BYTES_PER_ELEMENT } });
    }
  }
});

// node_modules/@kenjiuno/msgreader/lib/Reader.js
var require_Reader = __commonJS({
  "node_modules/@kenjiuno/msgreader/lib/Reader.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Reader = exports.TypeEnum = void 0;
    var DataStream_1 = __importDefault(require_DataStream());
    var utils_1 = require_utils();
    var const_1 = __importDefault(require_const());
    var TypeEnum;
    (function(TypeEnum2) {
      TypeEnum2[TypeEnum2["DIRECTORY"] = 1] = "DIRECTORY";
      TypeEnum2[TypeEnum2["DOCUMENT"] = 2] = "DOCUMENT";
      TypeEnum2[TypeEnum2["ROOT"] = 5] = "ROOT";
    })(TypeEnum || (exports.TypeEnum = TypeEnum = {}));
    var Reader = (
      /** @class */
      (function() {
        function Reader2(arrayBuffer) {
          this.ds = new DataStream_1.default(arrayBuffer, 0, DataStream_1.default.LITTLE_ENDIAN);
        }
        Reader2.prototype.isMSGFile = function() {
          this.ds.seek(0);
          return (0, utils_1.arraysEqual)(const_1.default.FILE_HEADER, this.ds.readInt8Array(const_1.default.FILE_HEADER.length));
        };
        Reader2.prototype.headerData = function() {
          this.bigBlockSize = this.ds.readByte(30) == const_1.default.MSG.L_BIG_BLOCK_MARK ? const_1.default.MSG.L_BIG_BLOCK_SIZE : const_1.default.MSG.S_BIG_BLOCK_SIZE;
          this.bigBlockLength = this.bigBlockSize / 4;
          this.xBlockLength = this.bigBlockLength - 1;
          this.batCount = this.ds.readInt(const_1.default.MSG.HEADER.BAT_COUNT_OFFSET);
          this.propertyStart = this.ds.readInt(const_1.default.MSG.HEADER.PROPERTY_START_OFFSET);
          this.sbatStart = this.ds.readInt(const_1.default.MSG.HEADER.SBAT_START_OFFSET);
          this.sbatCount = this.ds.readInt(const_1.default.MSG.HEADER.SBAT_COUNT_OFFSET);
          this.xbatStart = this.ds.readInt(const_1.default.MSG.HEADER.XBAT_START_OFFSET);
          this.xbatCount = this.ds.readInt(const_1.default.MSG.HEADER.XBAT_COUNT_OFFSET);
        };
        Reader2.prototype.convertName = function(offset) {
          var nameLength = this.ds.readShort(offset + const_1.default.MSG.PROP.NAME_SIZE_OFFSET);
          if (nameLength < 1) {
            return "";
          } else {
            return this.ds.readStringAt(offset, nameLength / 2).split("\0")[0];
          }
        };
        Reader2.prototype.convertProperty = function(offset) {
          return {
            type: this.ds.readByte(offset + const_1.default.MSG.PROP.TYPE_OFFSET),
            name: this.convertName(offset),
            // hierarchy
            previousProperty: this.ds.readInt(offset + const_1.default.MSG.PROP.PREVIOUS_PROPERTY_OFFSET),
            nextProperty: this.ds.readInt(offset + const_1.default.MSG.PROP.NEXT_PROPERTY_OFFSET),
            childProperty: this.ds.readInt(offset + const_1.default.MSG.PROP.CHILD_PROPERTY_OFFSET),
            // data offset
            startBlock: this.ds.readInt(offset + const_1.default.MSG.PROP.START_BLOCK_OFFSET),
            sizeBlock: this.ds.readInt(offset + const_1.default.MSG.PROP.SIZE_OFFSET)
          };
        };
        Reader2.prototype.convertBlockToProperties = function(propertyBlockOffset, props) {
          var propertyCount = this.bigBlockSize / const_1.default.MSG.PROP.PROPERTY_SIZE;
          var propertyOffset = this.getBlockOffsetAt(propertyBlockOffset);
          for (var i = 0; i < propertyCount; i++) {
            if (this.ds.byteLength < propertyOffset + const_1.default.MSG.PROP.TYPE_OFFSET) {
              break;
            }
            var propertyType = this.ds.readByte(propertyOffset + const_1.default.MSG.PROP.TYPE_OFFSET);
            switch (propertyType) {
              case const_1.default.MSG.PROP.TYPE_ENUM.ROOT:
              case const_1.default.MSG.PROP.TYPE_ENUM.DIRECTORY:
              case const_1.default.MSG.PROP.TYPE_ENUM.DOCUMENT:
                props.push(this.convertProperty(propertyOffset));
                break;
              case const_1.default.MSG.PROP.TYPE_ENUM.UNALLOCATED:
              default:
                props.push({
                  type: propertyType,
                  name: "",
                  previousProperty: -1,
                  nextProperty: -1,
                  childProperty: -1,
                  startBlock: 0,
                  sizeBlock: 0
                });
                break;
            }
            propertyOffset += const_1.default.MSG.PROP.PROPERTY_SIZE;
          }
        };
        Reader2.prototype.createPropertyHierarchy = function(props, nodeProperty) {
          if (!nodeProperty || nodeProperty.childProperty == const_1.default.MSG.PROP.NO_INDEX) {
            return;
          }
          nodeProperty.children = [];
          var children = [{ currentMode: "walk", currentIndex: nodeProperty.childProperty }];
          while (children.length != 0) {
            var _a = children.pop(), currentMode = _a.currentMode, currentIndex = _a.currentIndex;
            var current = props[currentIndex];
            if (currentMode === "push") {
              nodeProperty.children.push(currentIndex);
            } else {
              if (current.type == const_1.default.MSG.PROP.TYPE_ENUM.DIRECTORY) {
                this.createPropertyHierarchy(props, current);
              }
              if (current.nextProperty != const_1.default.MSG.PROP.NO_INDEX) {
                children.push({ currentMode: "walk", currentIndex: current.nextProperty });
              }
              children.push({ currentMode: "push", currentIndex });
              if (current.previousProperty != const_1.default.MSG.PROP.NO_INDEX) {
                children.push({ currentMode: "walk", currentIndex: current.previousProperty });
              }
            }
          }
        };
        Reader2.prototype.propertyDataReader = function(propertyStart) {
          var props = [];
          var currentOffset = propertyStart;
          while (currentOffset != const_1.default.MSG.END_OF_CHAIN) {
            this.convertBlockToProperties(currentOffset, props);
            currentOffset = this.getNextBlock(currentOffset);
          }
          this.createPropertyHierarchy(props, props[0]);
          return props;
        };
        Reader2.prototype.parse = function() {
          this.headerData();
          this.batData = this.batDataReader();
          if (this.xbatCount > 0) {
            this.xbatDataReader();
          }
          this.sbatData = this.sbatDataReader();
          this.propertyData = this.propertyDataReader(this.propertyStart);
          this.bigBlockTable = this.readBigBlockTable();
        };
        Reader2.prototype.batCountInHeader = function() {
          var maxBatsInHeader = (const_1.default.MSG.S_BIG_BLOCK_SIZE - const_1.default.MSG.HEADER.BAT_START_OFFSET) / 4;
          return Math.min(this.batCount, maxBatsInHeader);
        };
        Reader2.prototype.batDataReader = function() {
          var result = new Array(this.batCountInHeader());
          this.ds.seek(const_1.default.MSG.HEADER.BAT_START_OFFSET);
          for (var i = 0; i < result.length; i++) {
            result[i] = this.ds.readInt32();
          }
          return result;
        };
        Reader2.prototype.getBlockOffsetAt = function(offset) {
          return (offset + 1) * this.bigBlockSize;
        };
        Reader2.prototype.getBlockAt = function(offset) {
          var startOffset = this.getBlockOffsetAt(offset);
          this.ds.seek(startOffset);
          return this.ds.readInt32Array(this.bigBlockLength);
        };
        Reader2.prototype.getBlockValueAt = function(offset, index) {
          var startOffset = this.getBlockOffsetAt(offset);
          this.ds.seek(startOffset + 4 * index);
          return this.ds.readInt32();
        };
        Reader2.prototype.getNextBlockInner = function(offset, blockOffsetData) {
          var currentBlock = Math.floor(offset / this.bigBlockLength);
          var currentBlockIndex = offset % this.bigBlockLength;
          var startBlockOffset = blockOffsetData[currentBlock];
          if (typeof startBlockOffset === "undefined") {
            return const_1.default.MSG.END_OF_CHAIN;
          }
          return this.getBlockValueAt(startBlockOffset, currentBlockIndex);
        };
        Reader2.prototype.getNextBlock = function(offset) {
          return this.getNextBlockInner(offset, this.batData);
        };
        Reader2.prototype.sbatDataReader = function() {
          var result = [];
          var startIndex = this.sbatStart;
          for (var i = 0; i < this.sbatCount && startIndex && startIndex != const_1.default.MSG.END_OF_CHAIN; i++) {
            result.push(startIndex);
            startIndex = this.getNextBlock(startIndex);
          }
          return result;
        };
        Reader2.prototype.xbatDataReader = function() {
          var batCount = this.batCountInHeader();
          var batCountTotal = this.batCount;
          var remainingBlocks = batCountTotal - batCount;
          var nextBlockAt = this.xbatStart;
          for (var i = 0; i < this.xbatCount; i++) {
            var xBatBlock = this.getBlockAt(nextBlockAt);
            var blocksToProcess = Math.min(remainingBlocks, this.xBlockLength);
            for (var j = 0; j < blocksToProcess; j++) {
              var blockStartAt = xBatBlock[j];
              if (blockStartAt == const_1.default.MSG.UNUSED_BLOCK || blockStartAt == const_1.default.MSG.END_OF_CHAIN) {
                break;
              }
              this.batData.push(blockStartAt);
            }
            remainingBlocks -= blocksToProcess;
            nextBlockAt = xBatBlock[this.xBlockLength];
            if (nextBlockAt == const_1.default.MSG.UNUSED_BLOCK || nextBlockAt == const_1.default.MSG.END_OF_CHAIN) {
              break;
            }
          }
        };
        Reader2.prototype.getNextBlockSmall = function(offset) {
          return this.getNextBlockInner(offset, this.sbatData);
        };
        Reader2.prototype.getChainByBlockSmall = function(fieldProperty) {
          var blockChain = [];
          var nextBlockSmall = fieldProperty.startBlock;
          while (nextBlockSmall != const_1.default.MSG.END_OF_CHAIN) {
            blockChain.push(nextBlockSmall);
            nextBlockSmall = this.getNextBlockSmall(nextBlockSmall);
          }
          return blockChain;
        };
        Reader2.prototype.readBigBlockTable = function() {
          var rootProp = this.propertyData[0];
          var table = [];
          var nextBlock = rootProp.startBlock;
          for (var i = 0; nextBlock != const_1.default.MSG.END_OF_CHAIN; i++) {
            table.push(nextBlock);
            nextBlock = this.getNextBlock(nextBlock);
          }
          return table;
        };
        Reader2.prototype.readDataByBlockSmall = function(startBlock, blockSize, arr, dstOffset) {
          var byteOffset = startBlock * const_1.default.MSG.SMALL_BLOCK_SIZE;
          var bigBlockNumber = Math.floor(byteOffset / this.bigBlockSize);
          var bigBlockOffset = byteOffset % this.bigBlockSize;
          var nextBlock = this.bigBlockTable[bigBlockNumber];
          var blockStartOffset = this.getBlockOffsetAt(nextBlock);
          this.ds.seek(blockStartOffset + bigBlockOffset);
          return this.ds.readToUint8Array(blockSize, arr, dstOffset);
        };
        Reader2.prototype.readChainDataByBlockSmall = function(fieldProperty, chain) {
          var resultData = new Uint8Array(fieldProperty.sizeBlock);
          for (var i = 0, idx = 0; i < chain.length; i++) {
            var readLen = resultData.length < idx + const_1.default.MSG.SMALL_BLOCK_SIZE ? resultData.length - idx : const_1.default.MSG.SMALL_BLOCK_SIZE;
            this.readDataByBlockSmall(chain[i], readLen, resultData, idx);
            idx += readLen;
          }
          return resultData;
        };
        Reader2.prototype.readProperty = function(fieldProperty) {
          if (!fieldProperty.sizeBlock) {
            return new Uint8Array(0);
          } else if (fieldProperty.sizeBlock < const_1.default.MSG.BIG_BLOCK_MIN_DOC_SIZE) {
            var chain = this.getChainByBlockSmall(fieldProperty);
            if (chain.length == 1) {
              var resultData = new Uint8Array(fieldProperty.sizeBlock);
              this.readDataByBlockSmall(fieldProperty.startBlock, fieldProperty.sizeBlock, resultData, 0);
              return resultData;
            } else if (chain.length > 1) {
              return this.readChainDataByBlockSmall(fieldProperty, chain);
            }
            return new Uint8Array(0);
          } else {
            var nextBlock = fieldProperty.startBlock;
            var remaining = fieldProperty.sizeBlock;
            var position = 0;
            var resultData = new Uint8Array(fieldProperty.sizeBlock);
            while (1 <= remaining) {
              var blockStartOffset = this.getBlockOffsetAt(nextBlock);
              this.ds.seek(blockStartOffset);
              var partSize = Math.min(remaining, this.bigBlockSize);
              var part = this.ds.readUint8Array(partSize);
              resultData.set(part, position);
              position += partSize;
              remaining -= partSize;
              nextBlock = this.getNextBlock(nextBlock);
            }
            return resultData;
          }
        };
        Reader2.prototype.readFileOf = function(index) {
          return this.readProperty(this.propertyData[index]);
        };
        Reader2.prototype.folderOf = function(index) {
          var _this = this;
          var propertyData = this.propertyData;
          if (!propertyData) {
            return null;
          }
          var folder = propertyData[index];
          return {
            dataId: index,
            name: folder.name,
            fileNames: function() {
              var children = folder.children;
              if (children) {
                return children.map(function(subIndex) {
                  return propertyData[subIndex];
                }).filter(function(it) {
                  return it.type === TypeEnum.DOCUMENT;
                }).map(function(it) {
                  return it.name;
                });
              }
              return [];
            },
            fileNameSets: function() {
              var children = folder.children;
              if (children) {
                return children.map(function(subIndex) {
                  return {
                    subIndex,
                    entry: propertyData[subIndex]
                  };
                }).filter(function(it) {
                  return it.entry.type === TypeEnum.DOCUMENT;
                }).map(function(it) {
                  return {
                    name: it.entry.name,
                    length: it.entry.sizeBlock,
                    dataId: it.subIndex,
                    provider: function() {
                      return _this.readProperty(it.entry);
                    }
                  };
                });
              }
              return [];
            },
            subFolders: function() {
              var children = folder.children;
              if (children) {
                return children.filter(function(subIndex) {
                  return propertyData[subIndex].type == TypeEnum.DIRECTORY;
                }).map(function(subIndex) {
                  return _this.folderOf(subIndex);
                });
              }
              return [];
            },
            readFile: function(fileName) {
              var children = folder.children;
              if (children) {
                for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                  var subIndex = children_1[_i];
                  var file = propertyData[subIndex];
                  if (file && file.type === TypeEnum.DOCUMENT && file.name === fileName) {
                    return _this.readProperty(file);
                  }
                }
              }
              return null;
            }
          };
        };
        Reader2.prototype.rootFolder = function() {
          return this.folderOf(0);
        };
        return Reader2;
      })()
    );
    exports.Reader = Reader;
  }
});

// node_modules/@kenjiuno/msgreader/lib/Burner.js
var require_Burner = __commonJS({
  "node_modules/@kenjiuno/msgreader/lib/Burner.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.burn = burn;
    var Reader_1 = require_Reader();
    var DataStream_1 = __importDefault(require_DataStream());
    var const_1 = __importDefault(require_const());
    function RoundUpto512(bytes) {
      return bytes + 511 & ~511;
    }
    function RoundUpto64(bytes) {
      return bytes + 63 & ~63;
    }
    var LiteFat = (
      /** @class */
      (function() {
        function LiteFat2(source) {
          this.sectors = source;
        }
        LiteFat2.prototype.allocate = function(count) {
          var first = this.sectors.length;
          for (var x = 0; x < count; x++) {
            var next = x + 1 === count ? -2 : first + x + 1;
            this.sectors.push(next);
          }
          return first;
        };
        LiteFat2.prototype.allocateAs = function(count, value) {
          var first = this.sectors.length;
          for (var x = 0; x < count; x++) {
            this.sectors.push(value);
          }
          return first;
        };
        LiteFat2.prototype.finalize = function(boundary, value) {
          var num = (boundary - this.sectors.length % boundary) % boundary;
          for (; num >= 1; num -= 1) {
            this.sectors.push(value);
          }
          return this;
        };
        LiteFat2.prototype.count = function() {
          return this.sectors.length;
        };
        return LiteFat2;
      })()
    );
    var LiteBurner = (
      /** @class */
      (function() {
        function LiteBurner2(entries) {
          this.fat = new LiteFat([]);
          this.miniFat = new LiteFat([]);
          this.liteEnts = entries.map(function(it) {
            return {
              entry: it,
              left: -1,
              right: -1,
              child: -1,
              firstSector: 0,
              isMini: it.length < 4096,
              isRed: false
            };
          });
          this.buildTree(0);
          var entriesFirstSector = this.fat.allocate(RoundUpto512(128 * this.liteEnts.length) / 512);
          for (var _i = 0, _a = this.liteEnts.filter(function(it) {
            return it.entry.type == Reader_1.TypeEnum.DOCUMENT && it.isMini === false;
          }); _i < _a.length; _i++) {
            var liteEnt = _a[_i];
            liteEnt.firstSector = liteEnt.entry.length === 0 ? -2 : this.fat.allocate(RoundUpto512(liteEnt.entry.length) / 512);
          }
          for (var _b = 0, _c = this.liteEnts.filter(function(it) {
            return it.entry.type == Reader_1.TypeEnum.DOCUMENT && it.isMini === true;
          }); _b < _c.length; _b++) {
            var liteEnt = _c[_b];
            liteEnt.firstSector = liteEnt.entry.length === 0 ? -2 : this.miniFat.allocate(RoundUpto64(liteEnt.entry.length) / 64);
          }
          var numMiniFatSectors = RoundUpto512(4 * this.miniFat.count()) / 512;
          var firstMiniFatSector = numMiniFatSectors !== 0 ? this.fat.allocate(numMiniFatSectors) : -2;
          var bytesMiniFat = 64 * this.miniFat.count();
          var firstMiniDataSector = this.fat.allocate(RoundUpto512(bytesMiniFat) / 512);
          this.liteEnts[0].firstSector = firstMiniDataSector;
          var firstFatSector = this.fat.allocateAs(RoundUpto512(4 * (this.fat.count() + this.fat.count() / 128 + this.fat.count() / (128 * 109))) / 512, -3);
          var numFatSectors = this.fat.count() - firstFatSector;
          var numDifatSectors = numFatSectors > 109 ? RoundUpto512(4 * Math.floor((numFatSectors - 109) / 127 * 128)) / 512 : 0;
          var firstDifatSector = numDifatSectors !== 0 ? this.fat.allocateAs(numDifatSectors, -4) : -2;
          var array = new ArrayBuffer(512 * (1 + this.fat.count()));
          var ds = new DataStream_1.default(array, 0, DataStream_1.default.LITTLE_ENDIAN);
          ds.dynamicSize = false;
          this.miniFat.finalize(512 / 4, -1);
          var difat1 = [];
          var difat2 = [];
          {
            var x = 0;
            for (; x < 109 && x < numFatSectors; x++) {
              difat1.push(firstFatSector + x);
            }
            var nextDifatSector = firstDifatSector + 1;
            for (; x < numFatSectors; x++) {
              difat2.push(firstFatSector + x);
              var remain = difat2.length & 127;
              if (remain === 127) {
                difat2.push(nextDifatSector);
                nextDifatSector++;
              }
            }
            while (true) {
              var remain = difat2.length & 127;
              if (remain === 0) {
                break;
              }
              difat2.push(remain === 127 ? -2 : -1);
            }
          }
          {
            ds.seek(0);
            ds.writeUint8Array(const_1.default.FILE_HEADER);
            ds.seek(24);
            ds.writeUint16(62);
            ds.writeUint16(3);
            ds.writeUint16(65534);
            ds.writeUint16(9);
            ds.writeUint16(6);
            ds.seek(44);
            ds.writeInt32(numFatSectors);
            ds.writeInt32(entriesFirstSector);
            ds.seek(56);
            ds.writeInt32(4096);
            ds.writeInt32(firstMiniFatSector);
            ds.writeInt32(numMiniFatSectors);
            ds.writeInt32(firstDifatSector);
            ds.writeInt32(numDifatSectors);
            var x = 0;
            for (; x < difat1.length; x++) {
              ds.writeInt32(difat1[x]);
            }
            for (; x < 109; x++) {
              ds.writeInt32(-1);
            }
          }
          for (var x = 0; x < this.liteEnts.length; x++) {
            var liteEnt = this.liteEnts[x];
            var pos = 512 * (1 + entriesFirstSector) + 128 * x;
            ds.seek(pos);
            ds.writeUCS2String(liteEnt.entry.name, null, null);
            var numBytesName = ds.position - pos;
            ds.seek(pos + 64);
            ds.writeUint16(Math.min(64, numBytesName + 2));
            ds.writeUint8(liteEnt.entry.type);
            ds.writeUint8(liteEnt.isRed ? 0 : 1);
            ds.writeInt32(liteEnt.left);
            ds.writeInt32(liteEnt.right);
            ds.writeInt32(liteEnt.child);
            if (x === 0) {
              ds.seek(pos + 80);
              ds.writeUint8Array([11, 13, 2, 0, 0, 0, 0, 0, 192, 0, 0, 0, 0, 0, 0, 70]);
            }
            var length_1 = x === 0 ? bytesMiniFat : liteEnt.entry.length;
            var firstSector = length_1 !== 0 ? liteEnt.firstSector : liteEnt.entry.type === Reader_1.TypeEnum.DIRECTORY ? 0 : -2;
            ds.seek(pos + 116);
            ds.writeInt32(firstSector);
            ds.writeInt32(length_1);
          }
          for (var _d = 0, _e = this.liteEnts.filter(function(it) {
            return it.entry.type == Reader_1.TypeEnum.DOCUMENT && it.isMini === false;
          }); _d < _e.length; _d++) {
            var liteEnt = _e[_d];
            var bytes = liteEnt.entry.binaryProvider();
            ds.seek(512 * (1 + liteEnt.firstSector));
            ds.writeUint8Array(bytes);
          }
          for (var _f = 0, _g = this.liteEnts.filter(function(it) {
            return it.entry.type == Reader_1.TypeEnum.DOCUMENT && it.isMini === true;
          }); _f < _g.length; _f++) {
            var liteEnt = _g[_f];
            var bytes = liteEnt.entry.binaryProvider();
            ds.seek(512 * (1 + firstMiniDataSector) + 64 * liteEnt.firstSector);
            ds.writeUint8Array(bytes);
          }
          ds.seek(512 * (1 + firstMiniFatSector));
          ds.writeInt32Array(this.miniFat.sectors);
          this.fat.finalize(512 / 4, -1);
          ds.seek(512 * (1 + firstFatSector));
          ds.writeInt32Array(this.fat.sectors);
          if (numDifatSectors >= 1) {
            ds.seek(512 * (1 + firstDifatSector));
            ds.writeInt32Array(difat2);
          }
          this.array = array;
        }
        LiteBurner2.prototype.compareName = function(a, b) {
          var t = a.length - b.length;
          if (t === 0) {
            var x = a.toUpperCase();
            var y = b.toUpperCase();
            if (x > y) {
              t = 1;
            } else if (x < y) {
              t = -1;
            }
          }
          return t;
        };
        LiteBurner2.prototype.buildTree = function(dirIndex) {
          var _this = this;
          var liteEnts = this.liteEnts;
          var liteEntry = liteEnts[dirIndex];
          if (liteEntry.entry.type === Reader_1.TypeEnum.DOCUMENT) {
            throw new Error("It must be a storage!");
          }
          var children = liteEntry.entry.children.concat();
          if (1 <= children.length) {
            children.sort(function(a, b) {
              return _this.compareName(liteEnts[a].entry.name, liteEnts[b].entry.name);
            });
            var split2_1 = function(start, end, isRed) {
              if (start < end) {
                var midNum = Math.floor((start + end) / 2);
                var entryIndex = children[midNum];
                var entry = liteEnts[entryIndex];
                entry.isRed = isRed;
                entry.left = split2_1(start, midNum, !isRed);
                entry.right = split2_1(midNum + 1, end, !isRed);
                return entryIndex;
              } else {
                return -1;
              }
            };
            var split3 = function() {
              var midNum = Math.floor(children.length / 2);
              var entryIndex = children[midNum];
              var entry = liteEnts[entryIndex];
              entry.isRed = false;
              entry.left = split2_1(0, midNum, true);
              entry.right = split2_1(midNum + 1, children.length, true);
              return entryIndex;
            };
            liteEntry.child = split3();
            for (var _i = 0, _a = children.filter(function(it) {
              return liteEnts[it].entry.type === Reader_1.TypeEnum.DIRECTORY;
            }); _i < _a.length; _i++) {
              var subIndex = _a[_i];
              this.buildTree(subIndex);
            }
          }
        };
        return LiteBurner2;
      })()
    );
    function burn(entries) {
      return new Uint8Array(new LiteBurner(entries).array);
    }
  }
});

// node_modules/@kenjiuno/msgreader/lib/EntryStreamParser.js
var require_EntryStreamParser = __commonJS({
  "node_modules/@kenjiuno/msgreader/lib/EntryStreamParser.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parse = parse;
    var DataStream_1 = __importDefault(require_DataStream());
    function parse(array) {
      var ds = new DataStream_1.default(array, 0, DataStream_1.default.LITTLE_ENDIAN);
      var ret = [];
      while (!ds.isEof()) {
        var key = ds.readUint32();
        var low = ds.readUint16();
        var hi = ds.readUint16();
        ret.push({
          key,
          isStringProperty: (low & 1) != 0,
          guidIndex: low >> 1 & 32767,
          propertyIndex: hi
        });
      }
      return ret;
    }
  }
});

// node_modules/@kenjiuno/msgreader/lib/VerbStreamParser.js
var require_VerbStreamParser = __commonJS({
  "node_modules/@kenjiuno/msgreader/lib/VerbStreamParser.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parse = parse;
    function parse(ds) {
      var items = [];
      var count = 0;
      while (!ds.isEof()) {
        var version = ds.readUint16();
        if (version === 258) {
          count = ds.readUint16();
          var dummy1 = ds.readUint16();
          for (var index = 0; index < count; index += 1) {
            var VerbType = ds.readInt32();
            var DisplayNameCount = ds.readUint8();
            var DisplayName = ds.readString(DisplayNameCount);
            var MsgClsNameCount = ds.readUint8();
            var MsgClsName = ds.readString(MsgClsNameCount);
            var Internal1StringCount = ds.readUint8();
            var Internal1String = ds.readString(Internal1StringCount);
            var DisplayNameCountRepeat = ds.readUint8();
            var DisplayNameRepeat = ds.readString(DisplayNameCountRepeat);
            var Internal2 = ds.readInt32();
            var Internal3 = ds.readUint8();
            var fUseUSHeaders = ds.readInt32();
            var Internal4 = ds.readInt32();
            var SendBehavior = ds.readInt32();
            var Internal5 = ds.readInt32();
            var ID = ds.readInt32();
            var Internal6 = ds.readInt32();
            items.push({ VerbType, DisplayName });
          }
        } else if (version === 260) {
          for (var index = 0; index < count; index += 1) {
            var DisplayNameCount = ds.readUint8();
            var DisplayName = ds.readUCS2String(DisplayNameCount);
            var DisplayNameCountRepeat = ds.readUint8();
            var DisplayNameRepeat = ds.readUCS2String(DisplayNameCountRepeat);
            items[index].DisplayName = DisplayName;
          }
        }
      }
      return items.filter(function(it) {
        return it.VerbType === 4;
      }).map(function(it) {
        return it.DisplayName;
      }).join(";");
    }
  }
});

// node_modules/@kenjiuno/msgreader/lib/TZDEFINITIONParser.js
var require_TZDEFINITIONParser = __commonJS({
  "node_modules/@kenjiuno/msgreader/lib/TZDEFINITIONParser.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parse = parse;
    var utils_1 = require_utils();
    var TZDEFINITION_FLAG_VALID_GUID = 1;
    var TZDEFINITION_FLAG_VALID_KEYNAME = 2;
    function parse(ds) {
      var tz = { rules: [] };
      if (!ds.isEof()) {
        var bMajorVersion = ds.readUint8();
        if (bMajorVersion !== 2) {
          throw new Error("TZDEFINITION major version not supported");
        }
        var bMinorVersion = ds.readUint8();
        if (bMajorVersion < 1) {
          throw new Error("TZDEFINITION minor version not supported");
        }
        var cbHeader = ds.readUint16();
        var wFlags = ds.readUint16();
        if (wFlags & TZDEFINITION_FLAG_VALID_GUID) {
          ds.readInt32();
          ds.readInt32();
          ds.readInt32();
          ds.readInt32();
        }
        if (wFlags & TZDEFINITION_FLAG_VALID_KEYNAME) {
          var cchKeyName = ds.readUint16();
          tz.keyName = ds.readUCS2String(cchKeyName);
        }
        var cRules = ds.readUint16();
        ds.seek(4 + cbHeader);
        for (var x = 0; x < cRules; x++) {
          var bMajorVersion_1 = ds.readUint8();
          if (bMajorVersion_1 !== 2) {
            break;
          }
          var bMinorVersion_1 = ds.readUint8();
          if (bMajorVersion_1 < 1) {
            break;
          }
          var cbRule = ds.readUint16();
          var basePos = ds.position;
          var wFlags_1 = ds.readUint16();
          var stStart = (0, utils_1.readSystemTime)(ds);
          var lBias = ds.readInt32();
          var lStandardBias = ds.readInt32();
          var lDaylightBias = ds.readInt32();
          var stStandardDate = (0, utils_1.readTransitionSystemTime)(ds);
          var stDaylightDate = (0, utils_1.readTransitionSystemTime)(ds);
          var rule = Object.assign({}, {
            flags: wFlags_1,
            start: (stStart === null || stStart === void 0 ? void 0 : stStart.toUTCString()) || null,
            bias: lBias,
            standardBias: lStandardBias,
            daylightBias: lDaylightBias,
            standardDate: stStandardDate,
            daylightDate: stDaylightDate
          });
          tz.rules.push(rule);
          ds.seek(basePos + cbRule);
        }
      }
      return tz;
    }
  }
});

// node_modules/@kenjiuno/msgreader/lib/TZREGParser.js
var require_TZREGParser = __commonJS({
  "node_modules/@kenjiuno/msgreader/lib/TZREGParser.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parse = parse;
    var utils_1 = require_utils();
    function parse(ds) {
      if (!ds.isEof()) {
        var lBias = ds.readInt32();
        var lStandardBias = ds.readInt32();
        var lDaylightBias = ds.readInt32();
        var wStandardYear = ds.readUint16();
        var stStandardDate = (0, utils_1.readTransitionSystemTime)(ds);
        var wDaylightYear = ds.readUint16();
        var stDaylightDate = (0, utils_1.readTransitionSystemTime)(ds);
        return Object.assign({}, {
          bias: lBias,
          standardBias: lStandardBias,
          daylightBias: lDaylightBias,
          standardYear: wStandardYear,
          standardDate: stStandardDate,
          daylightYear: wDaylightYear,
          daylightDate: stDaylightDate
        });
      }
      return null;
    }
  }
});

// node_modules/@kenjiuno/msgreader/lib/AppointmentRecurParser.js
var require_AppointmentRecurParser = __commonJS({
  "node_modules/@kenjiuno/msgreader/lib/AppointmentRecurParser.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OverrideFlags = exports.EndType = exports.CalendarType = exports.PatternType = exports.RecurFrequency = void 0;
    exports.parse = parse;
    var RecurFrequency;
    (function(RecurFrequency2) {
      RecurFrequency2[RecurFrequency2["Daily"] = 8202] = "Daily";
      RecurFrequency2[RecurFrequency2["Weekly"] = 8203] = "Weekly";
      RecurFrequency2[RecurFrequency2["Monthly"] = 8204] = "Monthly";
      RecurFrequency2[RecurFrequency2["Yearly"] = 8205] = "Yearly";
    })(RecurFrequency || (exports.RecurFrequency = RecurFrequency = {}));
    var PatternType;
    (function(PatternType2) {
      PatternType2[PatternType2["Day"] = 0] = "Day";
      PatternType2[PatternType2["Week"] = 1] = "Week";
      PatternType2[PatternType2["Month"] = 2] = "Month";
      PatternType2[PatternType2["MonthEnd"] = 4] = "MonthEnd";
      PatternType2[PatternType2["MonthNth"] = 3] = "MonthNth";
      PatternType2[PatternType2["HjMonth"] = 10] = "HjMonth";
      PatternType2[PatternType2["HjMonthNth"] = 11] = "HjMonthNth";
      PatternType2[PatternType2["HjMonthEnd"] = 12] = "HjMonthEnd";
    })(PatternType || (exports.PatternType = PatternType = {}));
    var CalendarType;
    (function(CalendarType2) {
      CalendarType2[CalendarType2["Default"] = 0] = "Default";
      CalendarType2[CalendarType2["CAL_GREGORIAN"] = 1] = "CAL_GREGORIAN";
      CalendarType2[CalendarType2["CAL_GREGORIAN_US"] = 2] = "CAL_GREGORIAN_US";
      CalendarType2[CalendarType2["CAL_JAPAN"] = 3] = "CAL_JAPAN";
      CalendarType2[CalendarType2["CAL_TAIWAN"] = 4] = "CAL_TAIWAN";
      CalendarType2[CalendarType2["CAL_KOREA"] = 5] = "CAL_KOREA";
      CalendarType2[CalendarType2["CAL_HIJRI"] = 6] = "CAL_HIJRI";
      CalendarType2[CalendarType2["CAL_THAI"] = 7] = "CAL_THAI";
      CalendarType2[CalendarType2["CAL_HEBREW"] = 8] = "CAL_HEBREW";
      CalendarType2[CalendarType2["CAL_GREGORIAN_ME_FRENCH"] = 9] = "CAL_GREGORIAN_ME_FRENCH";
      CalendarType2[CalendarType2["CAL_GREGORIAN_ARABIC"] = 10] = "CAL_GREGORIAN_ARABIC";
      CalendarType2[CalendarType2["CAL_GREGORIAN_XLIT_ENGLISH"] = 11] = "CAL_GREGORIAN_XLIT_ENGLISH";
      CalendarType2[CalendarType2["CAL_GREGORIAN_XLIT_FRENCH"] = 12] = "CAL_GREGORIAN_XLIT_FRENCH";
      CalendarType2[CalendarType2["CAL_LUNAR_JAPANESE"] = 14] = "CAL_LUNAR_JAPANESE";
      CalendarType2[CalendarType2["CAL_CHINESE_LUNAR"] = 15] = "CAL_CHINESE_LUNAR";
      CalendarType2[CalendarType2["CAL_SAKA"] = 16] = "CAL_SAKA";
      CalendarType2[CalendarType2["CAL_LUNAR_ETO_CHN"] = 17] = "CAL_LUNAR_ETO_CHN";
      CalendarType2[CalendarType2["CAL_LUNAR_ETO_KOR"] = 18] = "CAL_LUNAR_ETO_KOR";
      CalendarType2[CalendarType2["CAL_LUNAR_ROKUYOU"] = 19] = "CAL_LUNAR_ROKUYOU";
      CalendarType2[CalendarType2["CAL_LUNAR_KOREAN"] = 20] = "CAL_LUNAR_KOREAN";
      CalendarType2[CalendarType2["CAL_UMALQURA"] = 23] = "CAL_UMALQURA";
    })(CalendarType || (exports.CalendarType = CalendarType = {}));
    var EndType;
    (function(EndType2) {
      EndType2[EndType2["EndAfterDate"] = 8225] = "EndAfterDate";
      EndType2[EndType2["EndAfterNOccurrences"] = 8226] = "EndAfterNOccurrences";
      EndType2[EndType2["NeverEnd"] = 8227] = "NeverEnd";
      EndType2[EndType2["NeverEnd2"] = 4294967295] = "NeverEnd2";
    })(EndType || (exports.EndType = EndType = {}));
    var OverrideFlags;
    (function(OverrideFlags2) {
      OverrideFlags2[OverrideFlags2["ARO_SUBJECT"] = 1] = "ARO_SUBJECT";
      OverrideFlags2[OverrideFlags2["ARO_MEETINGTYPE"] = 2] = "ARO_MEETINGTYPE";
      OverrideFlags2[OverrideFlags2["ARO_REMINDERDELTA"] = 4] = "ARO_REMINDERDELTA";
      OverrideFlags2[OverrideFlags2["ARO_REMINDER"] = 8] = "ARO_REMINDER";
      OverrideFlags2[OverrideFlags2["ARO_LOCATION"] = 16] = "ARO_LOCATION";
      OverrideFlags2[OverrideFlags2["ARO_BUSYSTATUS"] = 32] = "ARO_BUSYSTATUS";
      OverrideFlags2[OverrideFlags2["ARO_ATTACHMENT"] = 64] = "ARO_ATTACHMENT";
      OverrideFlags2[OverrideFlags2["ARO_SUBTYPE"] = 128] = "ARO_SUBTYPE";
      OverrideFlags2[OverrideFlags2["ARO_APPTCOLOR"] = 256] = "ARO_APPTCOLOR";
      OverrideFlags2[OverrideFlags2["ARO_EXCEPTIONAL_BODY"] = 512] = "ARO_EXCEPTIONAL_BODY";
    })(OverrideFlags || (exports.OverrideFlags = OverrideFlags = {}));
    function parseRecurrencePattern(ds) {
      var ReaderVersion = ds.readUint16();
      if (ReaderVersion !== 12292) {
        throw new Error("ReaderVersion not supported");
      }
      var WriterVersion = ds.readUint16();
      if (WriterVersion !== 12292) {
        throw new Error("WriterVersion not supported");
      }
      var recurFrequency = ds.readUint16();
      var patternType = ds.readUint16();
      var calendarType = ds.readUint16();
      var firstDateTime = ds.readUint32();
      var period = ds.readUint32();
      var slidingFlag = ds.readUint32();
      var patternTypeWeek = void 0;
      var patternTypeMonth = void 0;
      var patternTypeMonthNth = void 0;
      if (false) {
      } else if (patternType === PatternType.Week) {
        patternTypeWeek = {
          dayOfWeekBits: ds.readUint32()
        };
      } else if (patternType === PatternType.Month || patternType === PatternType.MonthEnd || patternType === PatternType.HjMonth || patternType === PatternType.HjMonthEnd) {
        patternTypeMonth = {
          day: ds.readUint32()
        };
      } else if (patternType === PatternType.MonthNth || patternType === PatternType.HjMonthNth) {
        patternTypeMonthNth = {
          dayOfWeekBits: ds.readUint32(),
          n: ds.readUint32()
        };
      }
      var endType = ds.readUint32();
      var occurrenceCount = ds.readUint32();
      var firstDOW = ds.readUint32();
      var deletedInstanceCount = ds.readUint32();
      var deletedInstanceDates = Array.from(ds.readUint32Array(deletedInstanceCount));
      var modifiedInstanceCount = ds.readUint32();
      var modifiedInstanceDates = Array.from(ds.readUint32Array(modifiedInstanceCount));
      var startDate = ds.readUint32();
      var endDate = ds.readUint32();
      return Object.assign({
        recurFrequency,
        patternType,
        calendarType,
        firstDateTime,
        period,
        slidingFlag,
        endType,
        occurrenceCount,
        firstDOW,
        deletedInstanceDates,
        modifiedInstanceDates,
        startDate,
        endDate
      }, patternTypeWeek ? { patternTypeWeek } : {}, patternTypeMonth ? { patternTypeMonth } : {}, patternTypeMonthNth ? { patternTypeMonthNth } : {});
    }
    function parse(ds, ansiEncoding) {
      var recurrencePattern = parseRecurrencePattern(ds);
      var readerVersion2 = ds.readUint32();
      if (readerVersion2 !== 12294) {
        throw new Error("ReaderVersion2 not supported");
      }
      var writerVersion2 = ds.readUint32();
      if (writerVersion2 < 12294) {
        throw new Error("WriterVersion2 not supported");
      }
      var startTimeOffset = ds.readUint32();
      var endTimeOffset = ds.readUint32();
      var exceptionCount = ds.readUint16();
      var exceptionInfo = [];
      for (var x = 0; x < exceptionCount; x++) {
        var startDateTime = ds.readUint32();
        var endDateTime = ds.readUint32();
        var originalStartTime = ds.readUint32();
        var overrideFlags = ds.readUint16();
        var subject = void 0;
        if (overrideFlags & OverrideFlags.ARO_SUBJECT) {
          var subjectLength = ds.readUint16();
          var subjectLength2 = ds.readUint16();
          if (subjectLength - 1 !== subjectLength2) {
            throw new Error("subjectLength ".concat(subjectLength, " and subjectLength2 ").concat(subjectLength2, " are not close!"));
          }
          subject = ds.readString(subjectLength2, ansiEncoding);
        }
        var meetingType = void 0;
        if (overrideFlags & OverrideFlags.ARO_MEETINGTYPE) {
          meetingType = ds.readUint32();
        }
        var reminderDelta = void 0;
        if (overrideFlags & OverrideFlags.ARO_REMINDERDELTA) {
          reminderDelta = ds.readUint32();
        }
        var reminderSet = void 0;
        if (overrideFlags & OverrideFlags.ARO_REMINDER) {
          reminderSet = ds.readUint32();
        }
        var location_1 = void 0;
        if (overrideFlags & OverrideFlags.ARO_LOCATION) {
          var locationLength = ds.readUint16();
          var locationLength2 = ds.readUint16();
          if (locationLength - 1 !== locationLength2) {
            throw new Error("locationLength ".concat(locationLength, " and locationLength2 ").concat(locationLength2, " are not close!"));
          }
          location_1 = ds.readString(locationLength2, ansiEncoding);
        }
        var busyStatus = void 0;
        if (overrideFlags & OverrideFlags.ARO_BUSYSTATUS) {
          busyStatus = ds.readUint32();
        }
        var attachment = void 0;
        if (overrideFlags & OverrideFlags.ARO_ATTACHMENT) {
          attachment = ds.readUint32();
        }
        var subType = void 0;
        if (overrideFlags & OverrideFlags.ARO_SUBTYPE) {
          subType = ds.readUint32();
        }
        var appointmentColor = void 0;
        if (overrideFlags & OverrideFlags.ARO_APPTCOLOR) {
          appointmentColor = ds.readUint32();
        }
        exceptionInfo.push(Object.assign({
          startDateTime,
          endDateTime,
          originalStartTime,
          overrideFlags
        }, subject ? { subject } : {}, meetingType ? { meetingType } : {}, reminderDelta ? { reminderDelta } : {}, reminderSet ? { reminderSet } : {}, location_1 ? { location: location_1 } : {}, busyStatus ? { busyStatus } : {}, attachment ? { attachment } : {}, subType ? { subType } : {}, appointmentColor ? { appointmentColor } : {}));
      }
      var reservedBlock1Size = ds.readUint32();
      if (reservedBlock1Size !== 0) {
        throw new Error("reservedBlock1Size ".concat(reservedBlock1Size, " is not zero, AppointmentRecur is broken"));
      }
      for (var x = 0; x < exceptionCount; x++) {
        var one = exceptionInfo[x];
        if (12297 <= writerVersion2) {
          var changeHighlightSize = ds.readUint32();
          one.changeHighlight = ds.readUint32();
          ds.position += changeHighlightSize - 4;
        }
        var reservedBlockEE1Size = ds.readUint32();
        if (reservedBlockEE1Size !== 0) {
          throw new Error("reservedBlockEE1Size ".concat(reservedBlockEE1Size, " is not zero, AppointmentRecur is broken"));
        }
        if (one.overrideFlags & (OverrideFlags.ARO_SUBJECT | OverrideFlags.ARO_LOCATION)) {
          var startDateTime = ds.readUint32();
          var endDateTime = ds.readUint32();
          var originalStartDate = ds.readUint32();
          if (one.overrideFlags & OverrideFlags.ARO_SUBJECT) {
            var wideCharSubjectLength = ds.readUint16();
            one.subject = ds.readUCS2String(wideCharSubjectLength);
          }
          if (one.overrideFlags & OverrideFlags.ARO_LOCATION) {
            var wideCharLocationLength = ds.readUint16();
            one.location = ds.readUCS2String(wideCharLocationLength);
          }
          var reservedBlockEE2Size = ds.readUint32();
          if (reservedBlockEE2Size !== 0) {
            throw new Error("reservedBlockEE2Size ".concat(reservedBlockEE2Size, " is not zero, AppointmentRecur is broken"));
          }
        }
      }
      var reservedBlock2Size = ds.readUint32();
      if (reservedBlock2Size !== 0) {
        throw new Error("reservedBlock2Size ".concat(reservedBlock2Size, " is not zero, AppointmentRecur is broken"));
      }
      return {
        recurrencePattern,
        startTimeOffset,
        endTimeOffset,
        exceptionInfo
      };
    }
  }
});

// node_modules/@kenjiuno/msgreader/lib/MsgReader.js
var require_MsgReader = __commonJS({
  "node_modules/@kenjiuno/msgreader/lib/MsgReader.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OverrideFlags = exports.EndType = exports.CalendarType = exports.PatternType = exports.RecurFrequency = void 0;
    var const_1 = __importDefault(require_const());
    var DataStream_1 = __importDefault(require_DataStream());
    var Reader_1 = require_Reader();
    var Burner_1 = require_Burner();
    var utils_1 = require_utils();
    var EntryStreamParser_1 = require_EntryStreamParser();
    var VerbStreamParser_1 = require_VerbStreamParser();
    var TZDEFINITIONParser_1 = require_TZDEFINITIONParser();
    var TZREGParser_1 = require_TZREGParser();
    var AppointmentRecurParser_1 = require_AppointmentRecurParser();
    var AppointmentRecurParser_2 = require_AppointmentRecurParser();
    Object.defineProperty(exports, "RecurFrequency", { enumerable: true, get: function() {
      return AppointmentRecurParser_2.RecurFrequency;
    } });
    Object.defineProperty(exports, "PatternType", { enumerable: true, get: function() {
      return AppointmentRecurParser_2.PatternType;
    } });
    Object.defineProperty(exports, "CalendarType", { enumerable: true, get: function() {
      return AppointmentRecurParser_2.CalendarType;
    } });
    Object.defineProperty(exports, "EndType", { enumerable: true, get: function() {
      return AppointmentRecurParser_2.EndType;
    } });
    Object.defineProperty(exports, "OverrideFlags", { enumerable: true, get: function() {
      return AppointmentRecurParser_2.OverrideFlags;
    } });
    var TypeEnum;
    (function(TypeEnum2) {
      TypeEnum2[TypeEnum2["DIRECTORY"] = 1] = "DIRECTORY";
      TypeEnum2[TypeEnum2["DOCUMENT"] = 2] = "DOCUMENT";
      TypeEnum2[TypeEnum2["ROOT"] = 5] = "ROOT";
    })(TypeEnum || (TypeEnum = {}));
    var KeyType;
    (function(KeyType2) {
      KeyType2[KeyType2["root"] = 0] = "root";
      KeyType2[KeyType2["toSub"] = 1] = "toSub";
      KeyType2[KeyType2["named"] = 2] = "named";
    })(KeyType || (KeyType = {}));
    function fileTimeToUnixEpoch(time) {
      return (time - 116444736e9) / 1e4;
    }
    function removeTrailingNull(text) {
      var index = text.indexOf("\0");
      if (index !== -1) {
        return text.substring(0, index);
      }
      return text;
    }
    var MsgReader2 = (
      /** @class */
      (function() {
        function MsgReader3(arrayBuffer) {
          this.reader = new Reader_1.Reader(arrayBuffer);
        }
        MsgReader3.prototype.decodeField = function(fieldClass, fieldType, provider, ansiEncoding, insideProps) {
          var array = provider();
          var ds = new DataStream_1.default(array, 0, DataStream_1.default.LITTLE_ENDIAN);
          var key = const_1.default.MSG.FIELD.FULL_NAME_MAPPING["".concat(fieldClass).concat(fieldType)] || const_1.default.MSG.FIELD.NAME_MAPPING[fieldClass];
          var keyType = KeyType.root;
          var propertySet = void 0;
          var propertyLid = void 0;
          var classValue = parseInt("0x".concat(fieldClass));
          if (classValue >= 32768) {
            var keyed = this.privatePidToKeyed[classValue];
            if (keyed) {
              if (keyed.useName) {
                key = keyed.name;
                keyType = KeyType.named;
              } else {
                propertySet = keyed.propertySet;
                propertyLid = (0, utils_1.toHex4)(keyed.propertyLid);
                var lidDict = const_1.default.MSG.FIELD.PIDLID_MAPPING[keyed.propertySet];
                if (lidDict !== void 0) {
                  var prop = lidDict[keyed.propertyLid];
                  if (prop !== void 0) {
                    if (prop.dispid !== void 0) {
                      key = prop.dispid;
                      keyType = KeyType.root;
                    } else {
                      key = prop.id;
                      keyType = KeyType.toSub;
                    }
                  }
                }
              }
            }
          }
          var value = array;
          var skip = false;
          var decodeAs = const_1.default.MSG.FIELD.TYPE_MAPPING[fieldType];
          if (0) {
          } else if (decodeAs === "string") {
            value = removeTrailingNull(ds.readString(array.length, ansiEncoding));
            skip = insideProps;
          } else if (decodeAs === "unicode") {
            value = removeTrailingNull(ds.readUCS2String(array.length / 2));
            skip = insideProps;
          } else if (decodeAs === "binary") {
            skip = insideProps;
          } else if (decodeAs === "integer") {
            value = ds.readUint32();
          } else if (decodeAs === "boolean") {
            value = ds.readUint16() ? true : false;
          } else if (decodeAs === "time") {
            var lo = ds.readUint32();
            var fileTime = lo + 4294967296 * ds.readUint32();
            value = new Date(fileTimeToUnixEpoch(fileTime)).toUTCString();
          }
          if (skip) {
            key = void 0;
          }
          if (0) {
          } else if (key === "PidLidVerbStream") {
            key = "votingOptions";
            keyType = KeyType.root;
            value = (0, VerbStreamParser_1.parse)(ds);
          } else if (key === "apptTZDefStartDisplay" || key === "apptTZDefEndDisplay" || key === "apptTZDefRecur") {
            keyType = KeyType.root;
            value = (0, TZDEFINITIONParser_1.parse)(ds);
          } else if (key === "timeZoneStruct") {
            value = (0, TZREGParser_1.parse)(ds);
          } else if (key === "apptRecur") {
            try {
              value = (0, AppointmentRecurParser_1.parse)(ds, ansiEncoding);
            } catch (ex) {
              console.debug(ex);
              key = void 0;
            }
          } else if (key === "recipType") {
            var MAPI_TO = 1;
            var MAPI_CC = 2;
            var MAPI_BCC = 3;
            if (0) {
            } else if (value === MAPI_TO) {
              value = "to";
            } else if (value === MAPI_CC) {
              value = "cc";
            } else if (value === MAPI_BCC) {
              value = "bcc";
            }
          } else if (key === "globalAppointmentID") {
            value = (0, utils_1.bin2HexUpper)(ds);
          }
          var propertyTag = "".concat(fieldClass).concat(fieldType);
          return { key, keyType, value, notForRawProp: skip, propertyTag, propertySet, propertyLid };
        };
        MsgReader3.prototype.fieldsDataDocument = function(parserConfig, documentProperty, fields) {
          var value = documentProperty.name.substring(12).toLowerCase();
          var fieldClass = value.substring(0, 4);
          var fieldType = value.substring(4, 8);
          parserConfig.propertyObserver && parserConfig.propertyObserver(fields, parseInt(value.substring(0, 8), 16), documentProperty.provider());
          if (fieldClass == const_1.default.MSG.FIELD.CLASS_MAPPING.ATTACHMENT_DATA) {
            fields.dataId = documentProperty.dataId;
            fields.contentLength = documentProperty.length;
          } else {
            this.setDecodedFieldTo(parserConfig, fields, this.decodeField(fieldClass, fieldType, documentProperty.provider, parserConfig.ansiEncoding, false));
          }
        };
        MsgReader3.prototype.setDecodedFieldTo = function(parserConfig, fields, pair) {
          var key = pair.key, keyType = pair.keyType, value = pair.value;
          if (key !== void 0) {
            if (keyType === KeyType.root) {
              fields[key] = value;
            }
          }
          if (parserConfig.includeRawProps === true) {
            fields.rawProps = fields.rawProps || [];
            if (!pair.notForRawProp) {
              fields.rawProps.push({
                propertyTag: pair.propertyTag,
                propertySet: pair.propertySet,
                propertyLid: pair.propertyLid,
                propertyName: pair.keyType === KeyType.named ? pair.key : void 0,
                value
              });
            }
          }
        };
        MsgReader3.prototype.getFieldType = function(fieldProperty) {
          var value = fieldProperty.name.substring(12).toLowerCase();
          return value.substring(4, 8);
        };
        MsgReader3.prototype.fieldsDataDirInner = function(parserConfig, dirProperty, rootFolder, fields) {
          var _this = this;
          if (dirProperty.name.indexOf(const_1.default.MSG.FIELD.PREFIX.ATTACHMENT) == 0) {
            var attachmentField = {
              dataType: "attachment"
            };
            fields.attachments.push(attachmentField);
            this.fieldsDataDir(parserConfig, dirProperty, rootFolder, attachmentField, "attachment");
          } else if (dirProperty.name.indexOf(const_1.default.MSG.FIELD.PREFIX.RECIPIENT) == 0) {
            var recipientField = {
              dataType: "recipient"
            };
            fields.recipients.push(recipientField);
            this.fieldsDataDir(parserConfig, dirProperty, rootFolder, recipientField, "recip");
          } else if (dirProperty.name.indexOf(const_1.default.MSG.FIELD.PREFIX.NAMEID) == 0) {
            this.fieldsNameIdDir(parserConfig, dirProperty, rootFolder, fields);
          } else {
            var childFieldType = this.getFieldType(dirProperty);
            if (childFieldType != const_1.default.MSG.FIELD.DIR_TYPE.INNER_MSG) {
            } else {
              var innerMsgContentFields = {
                dataType: "msg",
                attachments: [],
                recipients: []
              };
              this.fieldsDataDir(parserConfig, dirProperty, rootFolder, innerMsgContentFields, "sub");
              fields.innerMsgContentFields = innerMsgContentFields;
              fields.innerMsgContent = true;
              fields.folderId = dirProperty.dataId;
              this.innerMsgBurners[dirProperty.dataId] = function() {
                return _this.burnMsg(dirProperty, rootFolder);
              };
            }
          }
        };
        MsgReader3.prototype.burnMsg = function(folder, rootFolder) {
          var entries = [
            {
              name: "Root Entry",
              type: TypeEnum.ROOT,
              children: [],
              length: 0
            }
          ];
          this.registerFolder(entries, 0, folder, rootFolder, 0);
          return (0, Burner_1.burn)(entries);
        };
        MsgReader3.prototype.registerFolder = function(entries, index, folder, rootFolder, depth) {
          var _loop_1 = function(set2) {
            var provider = set2.provider, length_1 = set2.length;
            if (depth === 0 && set2.name === "__properties_version1.0") {
              var src = provider();
              var dst_1 = new Uint8Array(src.length + 8);
              dst_1.set(src.subarray(0, 24), 0);
              dst_1.set(src.subarray(24), 32);
              provider = function() {
                return dst_1;
              };
              length_1 = dst_1.length;
            }
            var subIndex2 = entries.length;
            entries[index].children.push(subIndex2);
            entries.push({
              name: set2.name,
              type: TypeEnum.DOCUMENT,
              binaryProvider: provider,
              length: length_1
            });
          };
          for (var _i = 0, _a = folder.fileNameSets(); _i < _a.length; _i++) {
            var set = _a[_i];
            _loop_1(set);
          }
          if (depth === 0) {
            var sources = rootFolder.subFolders().filter(function(it) {
              return it.name === const_1.default.MSG.FIELD.PREFIX.NAMEID;
            });
            for (var _b = 0, sources_1 = sources; _b < sources_1.length; _b++) {
              var source = sources_1[_b];
              var subIndex = entries.length;
              entries[index].children.push(subIndex);
              entries.push({
                name: source.name,
                type: TypeEnum.DIRECTORY,
                children: [],
                length: 0
              });
              this.registerFolder(entries, subIndex, source, rootFolder, depth + 1);
            }
          }
          for (var _c = 0, _d = folder.subFolders(); _c < _d.length; _c++) {
            var subFolder = _d[_c];
            var subIndex = entries.length;
            entries[index].children.push(subIndex);
            entries.push({
              name: subFolder.name,
              type: TypeEnum.DIRECTORY,
              children: [],
              length: 0
            });
            this.registerFolder(entries, subIndex, subFolder, rootFolder, depth + 1);
          }
        };
        MsgReader3.prototype.fieldsRecipAndAttachmentProperties = function(parserConfig, documentProperty, fields) {
          var propertiesBinary = documentProperty.provider();
          var propertiesDs = new DataStream_1.default(propertiesBinary, 8, DataStream_1.default.LITTLE_ENDIAN);
          this.importPropertiesFromFile(parserConfig, propertiesDs, fields);
        };
        MsgReader3.prototype.importPropertiesFromFile = function(parserConfig, propertiesDs, fields) {
          var typeConverters = {
            64: function(dataView) {
              var fileTime = dataView.getUint32(0, true) + 4294967296 * dataView.getUint32(4, true);
              return new Date(fileTimeToUnixEpoch(fileTime)).toUTCString();
            }
          };
          var _loop_2 = function() {
            var propertyTag = propertiesDs.readUint32();
            if (propertyTag === 0) {
              return "break";
            }
            var flags = propertiesDs.readUint32();
            var arr = propertiesDs.readUint8Array(8);
            parserConfig.propertyObserver(fields, propertyTag, arr);
            var fieldClass = (0, utils_1.toHex2)(propertyTag / 65536 & 65535);
            var fieldType = (0, utils_1.toHex2)(propertyTag & 65535);
            this_1.setDecodedFieldTo(parserConfig, fields, this_1.decodeField(fieldClass, fieldType, function() {
              return arr;
            }, parserConfig.ansiEncoding, true));
          };
          var this_1 = this;
          while (!propertiesDs.isEof()) {
            var state_1 = _loop_2();
            if (state_1 === "break")
              break;
          }
        };
        MsgReader3.prototype.fieldsRootProperties = function(parserConfig, documentProperty, fields) {
          var propertiesBinary = documentProperty.provider();
          var propertiesDs = new DataStream_1.default(propertiesBinary, 32, DataStream_1.default.LITTLE_ENDIAN);
          this.importPropertiesFromFile(parserConfig, propertiesDs, fields);
        };
        MsgReader3.prototype.fieldsDataDir = function(parserConfig, dirProperty, rootFolder, fields, subClass) {
          for (var _i = 0, _a = dirProperty.subFolders(); _i < _a.length; _i++) {
            var subFolder = _a[_i];
            this.fieldsDataDirInner(parserConfig, subFolder, rootFolder, fields);
          }
          for (var _b = 0, _c = dirProperty.fileNameSets(); _b < _c.length; _b++) {
            var fileSet = _c[_b];
            if (0) {
            } else if (fileSet.name.indexOf(const_1.default.MSG.FIELD.PREFIX.DOCUMENT) == 0) {
              this.fieldsDataDocument(parserConfig, fileSet, fields);
            } else if (fileSet.name === "__properties_version1.0") {
              if (subClass === "recip" || subClass === "attachment" || subClass === "sub") {
                this.fieldsRecipAndAttachmentProperties(parserConfig, fileSet, fields);
              } else if (subClass === "root") {
                this.fieldsRootProperties(parserConfig, fileSet, fields);
              }
            }
          }
        };
        MsgReader3.prototype.fieldsNameIdDir = function(parserConfig, dirProperty, rootFolder, fields) {
          var guidTable = void 0;
          var stringTable = void 0;
          var entryTable = void 0;
          for (var _i = 0, _a = dirProperty.fileNameSets(); _i < _a.length; _i++) {
            var fileSet = _a[_i];
            if (0) {
            } else if (fileSet.name.indexOf(const_1.default.MSG.FIELD.PREFIX.DOCUMENT) == 0) {
              var value = fileSet.name.substring(12).toLowerCase();
              var fieldClass = value.substring(0, 4);
              var fieldType = value.substring(4, 8);
              if (0) {
              } else if (fieldClass === "0002" && fieldType === "0102") {
                guidTable = fileSet.provider();
              } else if (fieldClass === "0003" && fieldType === "0102") {
                entryTable = fileSet.provider();
              } else if (fieldClass === "0004" && fieldType === "0102") {
                stringTable = fileSet.provider();
              }
            }
          }
          if (guidTable !== void 0 && stringTable !== void 0 && entryTable !== void 0) {
            var entries = (0, EntryStreamParser_1.parse)(entryTable);
            var stringReader = new DataStream_1.default(stringTable, 0, DataStream_1.default.LITTLE_ENDIAN);
            for (var _b = 0, entries_1 = entries; _b < entries_1.length; _b++) {
              var entry = entries_1[_b];
              if (entry.isStringProperty) {
                stringReader.seek(entry.key);
                var numTextBytes = stringReader.readUint32();
                this.privatePidToKeyed[32768 | entry.propertyIndex] = {
                  useName: true,
                  name: stringReader.readUCS2String(numTextBytes / 2)
                };
              } else {
                this.privatePidToKeyed[32768 | entry.propertyIndex] = {
                  useName: false,
                  propertySet: entry.guidIndex === 1 ? "00020328-00000-0000-C000-00000000046" : entry.guidIndex === 2 ? "00020329-00000-0000-C000-00000000046" : (0, utils_1.msftUuidStringify)(guidTable, 16 * (entry.guidIndex - 3)),
                  propertyLid: entry.key
                };
              }
            }
          }
        };
        MsgReader3.prototype.fieldsDataReader = function(parserConfig) {
          var fields = {
            dataType: "msg",
            attachments: [],
            recipients: []
          };
          this.fieldsDataDir(parserConfig, this.reader.rootFolder(), this.reader.rootFolder(), fields, "root");
          return fields;
        };
        MsgReader3.prototype.parseMsgData = function(parserConfig) {
          this.reader.parse();
          return this.fieldsDataReader(parserConfig);
        };
        MsgReader3.prototype.getFileData = function() {
          var _a, _b, _c;
          if (this.fieldsData === void 0) {
            if (!this.reader.isMSGFile()) {
              return {
                dataType: null,
                error: "Unsupported file type!"
              };
            }
            this.innerMsgBurners = {};
            this.privatePidToKeyed = {};
            this.fieldsData = this.parseMsgData({
              propertyObserver: ((_a = this.parserConfig) === null || _a === void 0 ? void 0 : _a.propertyObserver) || (function() {
              }),
              includeRawProps: ((_b = this.parserConfig) === null || _b === void 0 ? void 0 : _b.includeRawProps) ? true : false,
              ansiEncoding: (0, utils_1.emptyToNull)((_c = this.parserConfig) === null || _c === void 0 ? void 0 : _c.ansiEncoding)
            });
          }
          return this.fieldsData;
        };
        MsgReader3.prototype.getAttachment = function(attach) {
          var attachData = typeof attach === "number" ? this.fieldsData.attachments[attach] : attach;
          if (attachData.innerMsgContent === true && typeof attachData.folderId === "number") {
            return { fileName: attachData.name + ".msg", content: this.innerMsgBurners[attachData.folderId]() };
          } else {
            var fieldData = this.reader.readFileOf(attachData.dataId);
            return { fileName: attachData.fileName, content: fieldData };
          }
        };
        return MsgReader3;
      })()
    );
    exports.default = MsgReader2;
  }
});

// node_modules/@kenjiuno/msgreader/lib/index.js
var require_lib = __commonJS({
  "node_modules/@kenjiuno/msgreader/lib/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var MsgReader_1 = __importDefault(require_MsgReader());
    __exportStar(require_MsgReader(), exports);
    exports.default = MsgReader_1.default;
  }
});

// node_modules/@kenjiuno/decompressrtf/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/@kenjiuno/decompressrtf/lib/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decompressRTF = void 0;
    var Stream = (
      /** @class */
      (function() {
        function Stream2(buf) {
          this.buf = buf;
        }
        Stream2.prototype.readInt32LE = function(offset) {
          var value = this.buf[offset] & 255 | (this.buf[offset + 1] & 255) << 8 | (this.buf[offset + 2] & 255) << 16 | (this.buf[offset + 3] & 255) << 24;
          return value;
        };
        Stream2.prototype.readUInt16BE = function(offset) {
          var value = (this.buf[offset] & 255) << 8 | this.buf[offset + 1] & 255;
          return value;
        };
        Stream2.prototype.readUInt8 = function(offset) {
          var value = this.buf[offset] & 255;
          return value;
        };
        Stream2.prototype.writeUInt8 = function(value, offset) {
          this.buf[offset] = value & 255;
        };
        return Stream2;
      })()
    );
    function decompressRTF2(inputArray) {
      if (inputArray.length < 16) {
        throw new Error("At least 16 bytes");
      }
      var input = new Stream(inputArray);
      var fileSize = input.readInt32LE(0);
      var rawSize = input.readInt32LE(4);
      var compType = input.readInt32LE(8);
      var crc = input.readInt32LE(12);
      var COMPRESSED2 = 1967544908;
      var UNCOMPRESSED2 = 1095517517;
      if (compType == COMPRESSED2) {
        var initialDictionary = "{\\rtf1\\ansi\\mac\\deff0\\deftab720{\\fonttbl;}{\\f0\\fnil \\froman \\fswiss \\fmodern \\fscript \\fdecor MS Sans SerifSymbolArialTimes New RomanCourier{\\colortbl\\red0\\green0\\blue0\r\n\\par \\pard\\plain\\f0\\fs20\\b\\i\\u\\tab\\tx";
        var outputArray = [];
        var output = new Stream(outputArray);
        var outPos = 0;
        var inPos = 16;
        var control = void 0;
        for (var x = 0; x < initialDictionary.length; x += 1) {
          output.writeUInt8(initialDictionary.charCodeAt(x), outPos);
          outPos += 1;
        }
        var inEnd = fileSize + 4;
        for (var run_1 = 0; inPos < inEnd; run_1 = run_1 + 1 & 7) {
          if (0 == run_1) {
            control = input.readUInt8(inPos);
            inPos += 1;
          }
          if (0 != (1 << run_1 & control)) {
            var token = input.readUInt16BE(inPos);
            inPos += 2;
            var offset = token >> 4;
            var length_1 = (token & 15) + 2;
            var readPos = (outPos & ~4095) + offset;
            if (readPos == outPos) {
              break;
            }
            if (readPos > outPos) {
              readPos -= 4096;
            }
            for (var x = 0; x < length_1; x += 1) {
              var octet = output.readUInt8(readPos);
              output.writeUInt8(octet, outPos);
              readPos += 1;
              outPos += 1;
            }
          } else {
            var octet = input.readUInt8(inPos);
            output.writeUInt8(octet, outPos);
            inPos += 1;
            outPos += 1;
          }
        }
        return outputArray.slice(initialDictionary.length);
      } else if (compType == UNCOMPRESSED2) {
        return inputArray.slice(16, 16 + rawSize);
      } else {
        throw new Error("Either COMPRESSED or UNCOMPRESSED");
      }
    }
    exports.decompressRTF = decompressRTF2;
  }
});

// src/reader.js
var import_msgreader = __toESM(require_lib(), 1);

// src/errors.js
var MsgError = class extends Error {
  constructor(code, message, cause) {
    super(message);
    this.name = "MsgError";
    this.code = code;
    if (cause !== void 0) this.cause = cause;
  }
};

// src/cfb-guard.js
var END_OF_CHAIN = -2;
var FREE = -1;
var NO_INDEX = -1;
var MINI_CUTOFF = 4096;
var MINI_SECTOR = 64;
var DIR_ENTRY = 128;
var SIGNATURE = [208, 207, 17, 224, 161, 177, 26, 225];
function corrupt(detail) {
  return new MsgError("CORRUPT_CFB", `The file is damaged and cannot be read (detail: ${detail}).`);
}
function checkCompoundFile(u8) {
  if (!(u8 instanceof Uint8Array)) throw new MsgError("BAD_INPUT", "Input must be a Uint8Array or ArrayBuffer.");
  if (u8.length < 512) throw new MsgError("NOT_MSG", "The file is too small to be an Outlook .msg file.");
  for (let i = 0; i < 8; i++) {
    if (u8[i] !== SIGNATURE[i]) throw new MsgError("NOT_MSG", "The file is not an Outlook .msg file (no Compound File signature).");
  }
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  const i32 = (off) => {
    if (off < 0 || off + 4 > u8.length) throw corrupt(`read outside the file at offset ${off}`);
    return dv.getInt32(off, true);
  };
  const sectorSize = u8[30] === 12 ? 4096 : 512;
  const perSector = sectorSize / 4;
  const maxSectors = Math.ceil(u8.length / sectorSize) + 1;
  const batCount = i32(44);
  const dirStart = i32(48);
  const sbatStart = i32(60);
  const sbatCount = i32(64);
  const xbatStart = i32(68);
  const xbatCount = i32(72);
  for (const [name, v] of [["FAT count", batCount], ["mini FAT count", sbatCount], ["DIFAT count", xbatCount]]) {
    if (v < 0 || v > maxSectors) throw corrupt(`${name} ${v} is impossible for a ${u8.length}-byte file`);
  }
  const sectorOffset = (s) => (s + 1) * sectorSize;
  const bat = [];
  const inHeader = Math.min(batCount, (512 - 76) / 4);
  for (let i = 0; i < inHeader; i++) bat.push(i32(76 + 4 * i));
  if (xbatCount > 0) {
    let remaining = batCount - inHeader;
    let next = xbatStart;
    const seen = /* @__PURE__ */ new Set();
    for (let i = 0; i < xbatCount; i++) {
      if (seen.has(next)) throw corrupt("DIFAT chain loops");
      seen.add(next);
      const base = sectorOffset(next);
      const n = Math.min(remaining, perSector - 1);
      for (let j = 0; j < n; j++) {
        const v = i32(base + 4 * j);
        if (v === FREE || v === END_OF_CHAIN) break;
        bat.push(v);
      }
      remaining -= n;
      next = i32(base + 4 * (perSector - 1));
      if (next === FREE || next === END_OF_CHAIN) break;
    }
  }
  const nextIn = (table) => (offset) => {
    const block = Math.floor(offset / perSector);
    const idx = offset % perSector;
    const start = table[block];
    if (start === void 0) return END_OF_CHAIN;
    return i32(sectorOffset(start) + 4 * idx);
  };
  const nextBig = nextIn(bat);
  function chain(start, next, what, limit = maxSectors) {
    const out = [];
    const seen = /* @__PURE__ */ new Set();
    let cur = start;
    while (cur !== END_OF_CHAIN) {
      if (seen.has(cur)) throw corrupt(`${what} sector chain loops`);
      if (out.length >= limit) throw corrupt(`${what} sector chain is longer than the file`);
      seen.add(cur);
      out.push(cur);
      cur = next(cur);
    }
    return out;
  }
  const dirSectors = chain(dirStart, nextBig, "directory");
  const entries = [];
  for (const s of dirSectors) {
    const base = sectorOffset(s);
    for (let i = 0; i < sectorSize / DIR_ENTRY; i++) {
      const off = base + i * DIR_ENTRY;
      if (u8.length < off + 66) break;
      const type = u8[off + 66];
      if (type === 1 || type === 2 || type === 5) {
        entries.push({
          type,
          left: i32(off + 68),
          right: i32(off + 72),
          child: i32(off + 76),
          start: i32(off + 116),
          size: i32(off + 120)
        });
      } else {
        entries.push({ type, left: NO_INDEX, right: NO_INDEX, child: NO_INDEX, start: 0, size: 0 });
      }
    }
  }
  if (entries.length === 0 || entries[0].type !== 5) throw corrupt("no root entry");
  const sbat = [];
  {
    let cur = sbatStart;
    const seen = /* @__PURE__ */ new Set();
    for (let i = 0; i < sbatCount && cur && cur !== END_OF_CHAIN; i++) {
      if (seen.has(cur)) throw corrupt("mini FAT chain loops");
      seen.add(cur);
      sbat.push(cur);
      cur = nextBig(cur);
    }
  }
  const nextSmall = nextIn(sbat);
  const root = entries[0];
  const miniStreamSectors = chain(root.start, nextBig, "mini stream");
  const miniStreamBytes = miniStreamSectors.length * sectorSize;
  const visited = /* @__PURE__ */ new Set([0]);
  let streams = 0;
  const stack = [];
  if (root.child !== NO_INDEX) stack.push(root.child);
  while (stack.length) {
    const idx = stack.pop();
    if (idx === NO_INDEX) continue;
    if (idx < 0 || idx >= entries.length) throw corrupt(`directory entry ${idx} does not exist`);
    if (visited.has(idx)) throw corrupt("directory tree loops");
    visited.add(idx);
    const e = entries[idx];
    if (e.left !== NO_INDEX) stack.push(e.left);
    if (e.right !== NO_INDEX) stack.push(e.right);
    if (e.type === 1 && e.child !== NO_INDEX) stack.push(e.child);
    if (e.type === 2) {
      streams++;
      if (e.size < 0 || e.size > u8.length) throw corrupt(`stream size ${e.size} is larger than the file`);
      if (e.size === 0) continue;
      if (e.size < MINI_CUTOFF) {
        if (e.size > miniStreamBytes) throw corrupt("mini stream is smaller than a stream it holds");
        const c = chain(e.start, nextSmall, "mini stream", Math.ceil(miniStreamBytes / MINI_SECTOR) + 1);
        for (const ms of c) {
          const big = Math.floor(ms * MINI_SECTOR / sectorSize);
          if (ms < 0 || big >= miniStreamSectors.length) throw corrupt("mini sector outside the mini stream");
        }
      } else {
        const need = Math.ceil(e.size / sectorSize);
        let cur = e.start;
        const seen = /* @__PURE__ */ new Set();
        for (let k = 0; k < need; k++) {
          if (cur < 0 || sectorOffset(cur) + Math.min(sectorSize, e.size - k * sectorSize) > u8.length) {
            throw corrupt("stream data outside the file");
          }
          if (seen.has(cur)) throw corrupt("stream sector chain loops");
          seen.add(cur);
          cur = nextBig(cur);
        }
      }
    }
  }
  return { sectorSize, entries: entries.length, streams };
}

// src/reader.js
init_codepage();

// src/mime/encode.js
var B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var utf8 = new TextEncoder();
function base64(u8) {
  let out = "";
  const n = u8.length;
  let i = 0;
  for (; i + 2 < n; i += 3) {
    const v = u8[i] << 16 | u8[i + 1] << 8 | u8[i + 2];
    out += B64[v >> 18] + B64[v >> 12 & 63] + B64[v >> 6 & 63] + B64[v & 63];
  }
  if (i < n) {
    const v = u8[i] << 16 | (i + 1 < n ? u8[i + 1] : 0) << 8;
    out += B64[v >> 18] + B64[v >> 12 & 63] + (i + 1 < n ? B64[v >> 6 & 63] : "=") + "=";
  }
  return out;
}
function base64Body(u8) {
  const s = base64(u8);
  const lines = [];
  for (let i = 0; i < s.length; i += 76) lines.push(s.slice(i, i + 76));
  return lines.join("\r\n") + (lines.length ? "\r\n" : "");
}
var HEX = "0123456789ABCDEF";
function quotedPrintable(text) {
  const lines = String(text).replace(/\r\n|\r|\n/g, "\n").split("\n");
  const out = [];
  for (const line of lines) {
    const bytes = utf8.encode(line);
    let cur = "";
    for (let i = 0; i < bytes.length; i++) {
      const b = bytes[i];
      let tok;
      const last = i === bytes.length - 1;
      if ((b === 32 || b === 9) && last) tok = "=" + HEX[b >> 4] + HEX[b & 15];
      else if (b >= 33 && b <= 126 && b !== 61 || b === 32 || b === 9) tok = String.fromCharCode(b);
      else tok = "=" + HEX[b >> 4] + HEX[b & 15];
      if (cur === "" && tok === ".") tok = "=2E";
      if (cur.length + tok.length > 75) {
        out.push(cur + "=");
        cur = "";
      }
      cur += tok;
    }
    out.push(cur);
  }
  return out.join("\r\n") + "\r\n";
}
function is7bitSafe(text) {
  if (/[^\x01-\x7f]/.test(text)) return false;
  const lines = text.split(/\r\n|\r|\n/);
  for (const l of lines) if (l.length > 900) return false;
  return true;
}
function crlf(text) {
  const t = String(text).replace(/\r\n|\r|\n/g, "\r\n");
  return t.endsWith("\r\n") ? t : t + "\r\n";
}
function needsEncoding(s) {
  return /[^\x20-\x7e]/.test(s) || s.includes("=?");
}
function encodeWords(s) {
  const words = [];
  const maxBytes = 45;
  let chunk = [];
  let chunkLen = 0;
  const flush = () => {
    if (chunkLen) {
      const buf = new Uint8Array(chunkLen);
      let o = 0;
      for (const c of chunk) {
        buf.set(c, o);
        o += c.length;
      }
      words.push(`=?UTF-8?B?${base64(buf)}?=`);
      chunk = [];
      chunkLen = 0;
    }
  };
  for (const ch of s) {
    const b = utf8.encode(ch);
    if (chunkLen + b.length > maxBytes) flush();
    chunk.push(b);
    chunkLen += b.length;
  }
  flush();
  return words.join(" ");
}
function cleanHeaderText(s) {
  return String(s ?? "").replace(/[\r\n\t]+/g, " ").replace(/[\x00-\x1f\x7f]/g, "");
}
function stripTrailingNul(s) {
  if (typeof s !== "string") return s;
  let end = s.length;
  while (end > 0 && s.charCodeAt(end - 1) === 0) end--;
  return end === s.length ? s : s.slice(0, end);
}
var needsWordEncoding = (w) => /[^\x20-\x7e]/.test(w) || w.includes("=?");
function unstructured(s) {
  const clean = cleanHeaderText(s);
  if (!needsEncoding(clean)) return clean;
  const words = clean.split(" ");
  const out = [];
  let run = null;
  const flush = () => {
    if (run !== null) {
      out.push(encodeWords(run));
      run = null;
    }
  };
  for (const w of words) {
    if (w !== "" && needsWordEncoding(w)) {
      run = run === null ? w : `${run} ${w}`;
    } else if (w === "" && run !== null) {
      run += " ";
    } else {
      flush();
      out.push(w);
    }
  }
  flush();
  return out.join(" ");
}
var ATEXT = /^[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~ ]*$/;
function phrase(name) {
  const n = cleanHeaderText(name).replace(/ {2,}/g, " ").trim();
  if (!n) return "";
  if (needsEncoding(n)) return encodeWords(n);
  if (ATEXT.test(n) && !/^ | $|  /.test(n)) return n;
  return '"' + n.replace(/(["\\])/g, "\\$1") + '"';
}
function param(name, value) {
  const v = cleanHeaderText(value);
  if (!/[^\x20-\x7e]/.test(v) && v.length <= 60) {
    return `${name}="${v.replace(/(["\\])/g, "\\$1")}"`;
  }
  const pieces = [];
  let cur = "";
  for (const ch of v) {
    let tok = "";
    for (const b of utf8.encode(ch)) {
      const c = String.fromCharCode(b);
      tok += b < 128 && /[A-Za-z0-9!#$&+\-.^_`|~]/.test(c) ? c : "%" + HEX[b >> 4] + HEX[b & 15];
    }
    if (cur.length + tok.length > 50) {
      pieces.push(cur);
      cur = "";
    }
    cur += tok;
  }
  pieces.push(cur);
  if (pieces.length === 1) return `${name}*=UTF-8''${pieces[0]}`;
  return pieces.map((p, i) => i === 0 ? `${name}*0*=UTF-8''${p}` : `${name}*${i}*=${p}`).join(";\r\n ");
}
var HeaderInjectionError = class extends Error {
};
var HEADER_NAME = /^[!-9;-~]+$/;
function assertHeaderSafe(name, value, utf82 = false) {
  if (!HEADER_NAME.test(name)) throw new HeaderInjectionError(`invalid header name ${JSON.stringify(name)}`);
  const bad = utf82 ? /[\x00-\x08\x0a-\x1f\x7f]/ : /[^\x09\x20-\x7e]/;
  for (const seg of String(value).split("\r\n ")) {
    if (bad.test(seg)) throw new HeaderInjectionError(`unsafe character in ${name} header`);
  }
}
var MAX_LINE = 998;
function foldHeader(name, value, { utf8: utf82 = false } = {}) {
  assertHeaderSafe(name, value, utf82);
  const segments = String(value).split("\r\n ");
  let out = name + ":";
  let curLen = out.length;
  segments.forEach((segment, i) => {
    if (i > 0) {
      out += "\r\n";
      curLen = 0;
    }
    const words = [];
    for (const w of segment.split(" ")) {
      if (w === "" && words.length) words[words.length - 1] += " ";
      else words.push(w);
    }
    words.forEach((word, j) => {
      let piece = " " + word;
      if (j > 0 && curLen > 1 && curLen + piece.length > 76) {
        out += "\r\n";
        curLen = 0;
      }
      while (curLen + piece.length > MAX_LINE - 2) {
        const room = Math.max(1, MAX_LINE - 2 - curLen);
        out += piece.slice(0, room) + "\r\n";
        piece = " " + piece.slice(room);
        curLen = 0;
      }
      out += piece;
      curLen += piece.length;
    });
  });
  return out;
}

// src/reader.js
var MsgReader = import_msgreader.default.default || import_msgreader.default;
var EXTRA_MSG = {
  66: "sentRepresentingName",
  100: "sentRepresentingAddrType",
  101: "sentRepresentingEmail",
  4162: "inReplyTo",
  4153: "references",
  23: "importance",
  54: "sensitivity",
  3591: "messageFlagsRaw"
};
var EXTRA_RECIP = {
  12289: "displayName",
  24566: "recipientDisplayName",
  14846: "smtpAddress",
  12291: "emailAddress",
  12290: "addrType"
};
var EXTRA_ATTACH = {
  14085: "attachMethod",
  14099: "contentLocation",
  14102: "contentDisposition",
  14094: "mimeTag",
  32766: "hidden",
  14100: "attachFlags"
};
function toU8(input) {
  if (input instanceof Uint8Array) return input;
  if (input instanceof ArrayBuffer) return new Uint8Array(input);
  if (ArrayBuffer.isView(input)) return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
  throw new MsgError("BAD_INPUT", "Input must be a Uint8Array or ArrayBuffer.");
}
function decodeRaw(tag, raw, cp) {
  if (!raw) return void 0;
  const type = tag & 65535;
  const dv = new DataView(raw.buffer, raw.byteOffset, raw.byteLength);
  switch (type) {
    case 31:
      return trimNul(decodeBytes(raw, "utf-16le"));
    case 30:
      return trimNul(decodeBytes(raw, cp));
    case 3:
      return raw.length >= 4 ? dv.getInt32(0, true) : void 0;
    case 11:
      return raw.length >= 2 ? dv.getUint16(0, true) !== 0 : void 0;
    case 258:
      return raw;
    default:
      return void 0;
  }
}
function trimNul(s) {
  const i = s.indexOf("\0");
  return i >= 0 ? s.slice(0, i) : s;
}
function parseOnce(u8, ansiEncoding) {
  const extras = /* @__PURE__ */ new Map();
  let ansiHigh = false;
  const reader = new MsgReader(u8);
  reader.parserConfig = {
    ansiEncoding: ansiEncoding || void 0,
    propertyObserver(fields, tag, raw) {
      let m = extras.get(fields);
      if (!m) {
        m = /* @__PURE__ */ new Map();
        extras.set(fields, m);
      }
      if (!m.has(tag) || raw && raw.length !== 8) m.set(tag, raw);
      if ((tag & 65535) === 30 || (tag & 65535) === 4126) ansiHigh = true;
    }
  };
  const data = reader.getFileData();
  if (!data || data.error) {
    throw new MsgError("UNREADABLE", `The file could not be read as an Outlook message${data && data.error ? ` (${data.error})` : ""}.`);
  }
  return { reader, data, extras, ansiHigh };
}
function collect(extras, fields, table, cp) {
  const m = extras.get(fields);
  const out = {};
  if (!m) return out;
  for (const [tag, raw] of m) {
    const name = table[tag >>> 16];
    if (!name) continue;
    const type = tag & 65535;
    if (type === 3 || type === 11) {
      const v = decodeRaw(tag, raw, cp);
      if (v !== void 0) out[name] = v;
    } else {
      const v = decodeRaw(tag, raw, cp);
      if (v !== void 0 && v !== "") out[name] = v;
    }
  }
  return out;
}
function decodeHtmlBytes(bytes, internetCodepage) {
  let label = internetCodepage ? codepageLabel(internetCodepage) : null;
  if (!label) {
    const head = decodeBytes(bytes.subarray(0, 2048), "windows-1252");
    const m = /<meta[^>]+charset\s*=\s*["']?([A-Za-z0-9_\-:.]+)/i.exec(head);
    if (m) label = m[1];
  }
  if (!label) {
    try {
      return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
      label = "windows-1252";
    }
  }
  if (bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191) label = "utf-8";
  return decodeBytes(bytes, label);
}
function readHtmlBody(d, raw, cp) {
  const clean = (s) => {
    const t = typeof s === "string" ? stripTrailingNul(s) : "";
    return t === "" ? null : t;
  };
  if (d.html && d.html.length) {
    const v = clean(decodeHtmlBytes(d.html, d.internetCodepage));
    if (v) return v;
  }
  if (typeof d.bodyHtml === "string") {
    const v = clean(d.bodyHtml);
    if (v) return v;
  }
  if (raw) {
    for (const type of [258, 31, 30]) {
      const bytes = raw.get((4115 << 16 | type) >>> 0);
      if (!bytes || !bytes.length) continue;
      let v;
      if (type === 258) v = decodeHtmlBytes(bytes, d.internetCodepage);
      else if (type === 31) v = decodeBytes(bytes, "utf-16le");
      else v = decodeBytes(bytes, cp);
      v = clean(v);
      if (v) return v;
    }
  }
  return null;
}
var toDate = (s) => {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
};
function readMsg(input, opts = {}, depth = 0) {
  const maxDepth = opts.maxDepth ?? 16;
  if (depth > maxDepth) throw new MsgError("TOO_DEEP", `Embedded messages are nested more than ${maxDepth} levels deep.`);
  const u8 = toU8(input);
  checkCompoundFile(u8);
  let parsed;
  try {
    parsed = parseOnce(u8, null);
  } catch (e) {
    if (e instanceof MsgError) throw e;
    throw new MsgError("UNREADABLE", `The file could not be read as an Outlook message (${e && e.message ? e.message : e}).`, e);
  }
  const warnings = [];
  const cpChoice = chooseAnsiCodepage(parsed.data);
  let reparsed = false;
  if (parsed.ansiHigh) {
    try {
      parsed = parseOnce(u8, `cp${cpChoice.codepage}`);
      reparsed = true;
    } catch (e) {
      warnings.push(`Some text may show the wrong characters (code page ${cpChoice.codepage} could not be applied).`);
    }
  }
  const { reader, data: d, extras } = parsed;
  const cp = cpChoice.codepage;
  const x = collect(extras, d, EXTRA_MSG, cp);
  const model = {
    messageClass: d.messageClass || "IPM.Note",
    subject: d.subject ?? null,
    codepage: { ...cpChoice, applied: reparsed },
    sender: {
      name: d.senderName || "",
      email: d.senderEmail || "",
      addrType: d.senderAddressType || "",
      smtp: d.senderSmtpAddress || ""
    },
    representing: {
      name: x.sentRepresentingName || "",
      email: x.sentRepresentingEmail || "",
      addrType: x.sentRepresentingAddrType || "",
      smtp: d.sentRepresentingSmtpAddress || ""
    },
    recipients: [],
    transportHeaders: stripTrailingNul(d.headers || ""),
    dates: {
      submit: toDate(d.clientSubmitTime),
      delivery: toDate(d.messageDeliveryTime),
      creation: toDate(d.creationTime),
      modification: toDate(d.lastModificationTime)
    },
    messageId: d.messageId || null,
    inReplyTo: x.inReplyTo || null,
    references: x.references || null,
    importance: typeof x.importance === "number" ? x.importance : null,
    sensitivity: typeof x.sensitivity === "number" ? x.sensitivity : null,
    messageFlags: d.messageFlags ?? null,
    // MS-OXMSG string and body streams are often padded with NULs after
    // the text (QA defect 1: about 7,400 after </html>); they are removed.
    body: d.body == null ? null : stripTrailingNul(d.body),
    html: null,
    htmlProperty: !!(d.html || d.bodyHtml) || [...(extras.get(d) || /* @__PURE__ */ new Map()).keys()].some((t) => t >>> 16 === 4115),
    compressedRtf: d.compressedRtf || null,
    internetCodepage: d.internetCodepage || null,
    appointment: {
      start: toDate(d.apptStartWhole),
      end: toDate(d.apptEndWhole),
      location: d.apptLocation || d.location || "",
      globalId: d.globalAppointmentID || null,
      recur: d.apptRecur || null,
      tzStart: d.apptTZDefStartDisplay || null,
      tzEnd: d.apptTZDefEndDisplay || null,
      tzRecur: d.apptTZDefRecur || null,
      tzStruct: d.timeZoneStruct || null,
      tzDesc: d.timeZoneDesc || ""
    },
    contact: d.messageClass && /^IPM\.Contact/i.test(d.messageClass) ? d : null,
    attachments: [],
    warnings
  };
  model.html = readHtmlBody(d, extras.get(d), cp);
  if (model.htmlProperty && model.html == null) {
    warnings.push(`The HTML version of the body could not be read.${model.body ? " The plain-text version is shown." : ""}`);
  }
  for (const rc of d.recipients || []) {
    const rx = collect(extras, rc, EXTRA_RECIP, cp);
    model.recipients.push({
      type: rc.recipType || "to",
      name: rc.name || rx.recipientDisplayName || rx.displayName || "",
      email: rc.email || rx.emailAddress || "",
      addrType: rc.addressType || rx.addrType || "",
      smtp: rc.smtpAddress || rx.smtpAddress || ""
    });
  }
  (d.attachments || []).forEach((a, index) => {
    const ax = collect(extras, a, EXTRA_ATTACH, cp);
    const att = {
      index,
      filename: a.fileName || a.fileNameShort || a.name || "",
      displayName: a.name || "",
      extension: a.extension || "",
      mime: a.attachMimeTag || ax.mimeTag || "",
      cid: a.pidContentId || null,
      contentLocation: ax.contentLocation || null,
      hidden: !!(a.attachmentHidden || ax.hidden),
      method: typeof ax.attachMethod === "number" ? ax.attachMethod : null,
      data: null,
      embedded: null,
      error: null
    };
    try {
      if (a.innerMsgContent) {
        const g = reader.getAttachment(a);
        att.embedded = readMsg(g.content, opts, depth + 1);
        att.filename = att.filename || g.fileName || "";
      } else if (att.method === 2 || att.method === 3 || att.method === 4 || att.method === 7) {
        att.error = "it is only a link to a file outside the message";
      } else {
        const g = reader.getAttachment(a);
        att.data = g.content instanceof Uint8Array ? g.content : new Uint8Array(g.content || []);
      }
    } catch (e) {
      if (e instanceof MsgError && e.code === "TOO_DEEP") throw e;
      att.error = e instanceof MsgError ? e.message : `it could not be read: ${e && e.message ? e.message : e}`;
    }
    model.attachments.push(att);
  });
  return model;
}

// src/mime/part.js
var Part = class _Part {
  constructor(type) {
    this.type = type;
    this.params = [];
    this.headers = [];
    this.body = null;
    this.cte = null;
    this.children = null;
    this.raw = null;
  }
  static text(subtype, text, extra = {}) {
    const p = new _Part(`text/${subtype}`);
    p.params.push(["charset", "utf-8"]);
    if (extra.method) p.params.push(["method", extra.method]);
    const t = String(text);
    if (is7bitSafe(t)) {
      p.cte = "7bit";
      p.body = crlf(t);
    } else {
      p.cte = "quoted-printable";
      p.body = quotedPrintable(t);
    }
    return p;
  }
  static binary(type, bytes, { filename, cid, inline, description } = {}) {
    const p = new _Part(type);
    if (filename) p.params.push([null, param("name", filename)]);
    p.cte = "base64";
    p.body = base64Body(bytes);
    if (filename || !inline) {
      const disp = inline ? "inline" : "attachment";
      p.headers.push(["Content-Disposition", filename ? `${disp}; ${param("filename", filename)}` : disp]);
    } else {
      p.headers.push(["Content-Disposition", "inline"]);
    }
    if (cid) {
      if (!isValidCid(cid)) throw new Error("invalid Content-ID reached the serializer");
      p.headers.push(["Content-ID", `<${cid}>`]);
    }
    if (description) p.headers.push(["Content-Description", unstructured(description)]);
    return p;
  }
  static multipart(subtype, children, params = []) {
    const p = new _Part(`multipart/${subtype}`);
    p.children = children;
    p.params.push(...params);
    return p;
  }
  /** message/rfc822 wrapping an already serialized message (Uint8Array). */
  static message(bytes, { filename } = {}) {
    const p = new _Part("message/rfc822");
    p.cte = hasHighBytes(bytes) ? "8bit" : "7bit";
    p.body = bytes;
    const disp = filename ? `attachment; ${param("filename", filename)}` : "attachment";
    p.headers.push(["Content-Disposition", disp]);
    return p;
  }
  /** A complete entity (headers and body) used verbatim. */
  static rawEntity(bytes) {
    const p = new _Part(null);
    p.raw = bytes;
    return p;
  }
};
function isValidCid(cid) {
  return typeof cid === "string" && cid.length > 0 && cid.length <= 900 && /^[\x21-\x3b\x3d\x3f-\x7e]+$/.test(cid);
}
function hasHighBytes(u8) {
  for (let i = 0; i < u8.length; i++) if (u8[i] > 127) return true;
  return false;
}
function contentTypeValue(part, boundary) {
  const ps = part.params.map(([k, v]) => k === null ? v : `${k}=${v}`);
  if (boundary) ps.push(`boundary="${boundary}"`);
  return [part.type, ...ps].join("; ");
}
function chunksToLatin1(chunks) {
  let s = "";
  for (const c of chunks) {
    if (typeof c === "string") s += c;
    else for (let i = 0; i < c.length; i += 8192) s += String.fromCharCode.apply(null, c.subarray(i, i + 8192));
  }
  return s;
}
function serializePart(part, ctx, extraHeaders = []) {
  if (part.raw) return [part.raw];
  const out = [];
  const head = [...extraHeaders];
  if (part.children) {
    const childChunks = part.children.map((c) => serializePart(c, ctx));
    const all = chunksToLatin1(childChunks.flat());
    let boundary;
    do {
      ctx.n++;
      boundary = `=_mec_${ctx.n.toString(36)}_${(ctx.salt || 0).toString(36)}`;
    } while (all.includes("--" + boundary));
    head.push(["Content-Type", contentTypeValue(part, boundary)]);
    head.push(...part.headers);
    for (const [k, v] of head) out.push(foldHeader(k, v, ctx) + "\r\n");
    out.push("\r\n");
    for (const cc of childChunks) {
      out.push(`--${boundary}\r
`);
      out.push(...cc);
    }
    out.push(`--${boundary}--\r
`);
    return out;
  }
  head.push(["Content-Type", contentTypeValue(part)]);
  if (part.cte) head.push(["Content-Transfer-Encoding", part.cte]);
  head.push(...part.headers);
  for (const [k, v] of head) out.push(foldHeader(k, v, ctx) + "\r\n");
  out.push("\r\n");
  out.push(part.body);
  const last = part.body;
  const endsCrlf = typeof last === "string" ? last.endsWith("\r\n") : last.length >= 2 && last[last.length - 2] === 13 && last[last.length - 1] === 10;
  if (!endsCrlf) out.push("\r\n");
  return out;
}
var utf8enc = new TextEncoder();
function concatChunks(chunks) {
  const conv = chunks.map((c) => typeof c === "string" && /[^\x00-\x7f]/.test(c) ? utf8enc.encode(c) : c);
  let len = 0;
  for (const c of conv) len += c.length;
  const u8 = new Uint8Array(len);
  let o = 0;
  for (const c of conv) {
    if (typeof c === "string") {
      for (let i = 0; i < c.length; i++) u8[o++] = c.charCodeAt(i);
    } else {
      u8.set(c, o);
      o += c.length;
    }
  }
  return u8;
}
function splitEntity(u8) {
  const n = Math.min(u8.length, 65536);
  let end = -1;
  let bodyStart = 0;
  for (let i = 0; i < n; i++) {
    if (u8[i] === 10 && u8[i + 1] === 10) {
      end = i;
      bodyStart = i + 2;
      break;
    }
    if (u8[i] === 13 && u8[i + 1] === 10 && u8[i + 2] === 13 && u8[i + 3] === 10) {
      end = i;
      bodyStart = i + 4;
      break;
    }
  }
  if (end < 0) return { headerLines: [], bodyStart: 0 };
  const text = String.fromCharCode.apply(null, u8.subarray(0, end));
  const headerLines = [];
  for (const line of text.split(/\r?\n/)) {
    if (/^[ \t]/.test(line) && headerLines.length) headerLines[headerLines.length - 1] += "\n" + line;
    else if (line.includes(":")) headerLines.push(line);
  }
  return { headerLines, bodyStart };
}
function serializeMessage(headers, root, salt = 0, { utf8: utf82 = false } = {}) {
  const ctx = { n: 0, salt, utf8: utf82 };
  const top = [...headers, ["MIME-Version", "1.0"]];
  if (root.raw) {
    const { headerLines, bodyStart } = splitEntity(root.raw);
    const have = new Set(top.map(([k]) => k.toLowerCase()));
    const chunks = top.map(([k, v]) => foldHeader(k, v, ctx) + "\r\n");
    for (const line of headerLines) {
      const name = line.slice(0, line.indexOf(":")).trim().toLowerCase();
      if (have.has(name)) continue;
      if (/[\x00-\x08\x0b-\x1f\x7f]/.test(line.replace(/\r?\n(?=[ \t])/g, "")) || !/^[!-9;-~]+$/.test(line.slice(0, line.indexOf(":")))) continue;
      chunks.push(line.replace(/\r?\n/g, "\r\n") + "\r\n");
    }
    chunks.push("\r\n");
    chunks.push(root.raw.subarray(bodyStart));
    return concatChunks(chunks);
  }
  return concatChunks(serializePart(root, ctx, top));
}

// src/headers.js
init_codepage();
function parseHeaderBlock(text) {
  if (!text) return [];
  const lines = String(text).replace(/\r\n|\r/g, "\n").split("\n");
  const out = [];
  for (const line of lines) {
    if (line === "") {
      if (out.length) break;
      continue;
    }
    if (/^[ \t]/.test(line)) {
      if (out.length) out[out.length - 1][1] += " " + line.trim();
      continue;
    }
    const m = /^([!-9;-~]+):[ \t]*(.*)$/.exec(line);
    if (m) out.push([m[1], m[2].trim()]);
  }
  return out;
}
function headerValue(pairs, name) {
  const n = name.toLowerCase();
  for (const [k, v] of pairs) if (k.toLowerCase() === n) return v;
  return null;
}
function b64decode(s) {
  const map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const clean = s.replace(/[^A-Za-z0-9+/]/g, "");
  const out = [];
  let buf = 0;
  let bits = 0;
  for (const ch of clean) {
    buf = buf << 6 | map.indexOf(ch);
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out.push(buf >> bits & 255);
    }
  }
  return Uint8Array.from(out);
}
function decodeWords(s) {
  if (!s || !s.includes("=?")) return s;
  return s.replace(/(=\?[^?\s]+\?[bBqQ]\?[^?\s]*\?=)\s+(?==\?)/g, "$1").replace(/=\?([^?\s]+)\?([bBqQ])\?([^?\s]*)\?=/g, (all, cs, enc, text) => {
    const charset = cs.split("*")[0];
    let bytes;
    if (enc.toUpperCase() === "B") bytes = b64decode(text);
    else {
      const arr = [];
      const t = text.replace(/_/g, " ");
      for (let i = 0; i < t.length; i++) {
        if (t[i] === "=" && /^[0-9A-Fa-f]{2}$/.test(t.slice(i + 1, i + 3))) {
          arr.push(parseInt(t.slice(i + 1, i + 3), 16));
          i += 2;
        } else arr.push(t.charCodeAt(i) & 255);
      }
      bytes = Uint8Array.from(arr);
    }
    try {
      return decodeBytes(bytes, charset);
    } catch {
      return all;
    }
  });
}
function parseAddressList(value) {
  if (!value) return [];
  const items = [];
  let cur = "";
  let inQuote = false;
  let angle = 0;
  let paren = 0;
  for (let i = 0; i < value.length; i++) {
    const c = value[i];
    if (inQuote) {
      cur += c;
      if (c === "\\" && i + 1 < value.length) {
        cur += value[++i];
        continue;
      }
      if (c === '"') inQuote = false;
      continue;
    }
    if (paren) {
      if (c === "(") paren++;
      else if (c === ")") paren--;
      cur += c;
      continue;
    }
    if (c === '"') {
      inQuote = true;
      cur += c;
      continue;
    }
    if (c === "(") {
      paren++;
      cur += c;
      continue;
    }
    if (c === "<") angle++;
    if (c === ">") angle = Math.max(0, angle - 1);
    if (!angle && (c === "," || c === ";")) {
      items.push(cur);
      cur = "";
      continue;
    }
    if (!angle && c === ":") {
      cur = "";
      continue;
    }
    cur += c;
  }
  items.push(cur);
  const out = [];
  for (const raw of items) {
    const { name, email } = parseMailbox(raw);
    if (name || email) out.push({ name, email });
  }
  return out;
}
function parseMailbox(raw) {
  let text = "";
  let comment = "";
  let depth = 0;
  let inQuote = false;
  let angleStart = -1;
  let angleEnd = -1;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (depth) {
      if (c === "\\" && i + 1 < raw.length) {
        comment += raw[++i];
        continue;
      }
      if (c === "(") depth++;
      else if (c === ")") {
        depth--;
        if (!depth) {
          comment += " ";
          continue;
        }
      }
      if (depth) comment += c;
      continue;
    }
    if (inQuote) {
      text += c;
      if (c === "\\" && i + 1 < raw.length) {
        text += raw[++i];
        continue;
      }
      if (c === '"') inQuote = false;
      continue;
    }
    if (c === "(") {
      depth = 1;
      continue;
    }
    if (c === '"') {
      inQuote = true;
      text += c;
      continue;
    }
    if (c === "<" && angleStart < 0) angleStart = text.length;
    else if (c === ">" && angleStart >= 0 && angleEnd < 0) angleEnd = text.length;
    text += c;
  }
  let name = "";
  let email = "";
  if (angleStart >= 0) {
    name = text.slice(0, angleStart).trim();
    email = text.slice(angleStart + 1, angleEnd >= 0 ? angleEnd : text.length).trim();
  } else {
    email = text.trim();
    name = comment.trim();
  }
  if (name.length >= 2 && name.startsWith('"') && name.endsWith('"')) {
    name = name.slice(1, -1).replace(/\\(.)/g, "$1");
  }
  name = decodeWords(name.replace(/\s+/g, " ")).trim();
  if (email.startsWith("mailto:")) email = email.slice(7);
  return { name, email };
}
function isSmtp(addr) {
  if (!addr || typeof addr !== "string") return false;
  const a = addr.trim();
  if (a.startsWith("/")) return false;
  return /^[^\s@<>()",;:\x00-\x1f\x7f]+@[^\s@<>()",;:\x00-\x1f\x7f]+$/.test(a);
}

// src/address.js
var norm = (s) => String(s || "").trim().toLowerCase();
function headerList(ctx, name) {
  if (!ctx.lists) ctx.lists = /* @__PURE__ */ new Map();
  const key = name.toLowerCase();
  if (!ctx.lists.has(key)) ctx.lists.set(key, parseAddressList(headerValue(ctx.headers, name) || ""));
  return ctx.lists.get(key);
}
function buildDnMap(model) {
  const map = /* @__PURE__ */ new Map();
  const add = (dn, smtp) => {
    if (dn && String(dn).startsWith("/") && isSmtp(smtp)) map.set(norm(dn), smtp.trim());
  };
  for (const r of model.recipients) add(r.email, r.smtp);
  add(model.sender.email, model.sender.smtp);
  add(model.representing.email, model.representing.smtp);
  return map;
}
function pick(...cands) {
  for (const c of cands) if (c && isSmtp(c.value)) return { email: c.value.trim(), source: c.source };
  return null;
}
var dnOf = (p) => p.email && String(p.email).startsWith("/") ? String(p.email).trim() : null;
function resolvePerson(p, ctx, headerName, o = {}) {
  const dnMap = ctx.dnMap;
  const fromHeader = headerName ? headerList(ctx, headerName) : [];
  const hdr = fromHeader.find((a) => isSmtp(a.email) && (!p.name || norm(a.name) === norm(p.name))) || (o.author && fromHeader.length === 1 && isSmtp(fromHeader[0].email) ? fromHeader[0] : null);
  const r = pick(
    { value: p.smtp, source: "smtp-property" },
    { value: norm(p.addrType) === "smtp" || !p.addrType ? p.email : null, source: "email-address-property" },
    { value: hdr && hdr.email, source: "transport-headers" },
    { value: p.email && dnMap.get(norm(p.email)), source: "dn-matched-in-message" },
    { value: p.email, source: "email-address-property" }
  );
  let name = p.name && p.name.trim() || hdr && hdr.name || "";
  let nameSource = p.name && p.name.trim() ? "mapi" : hdr && hdr.name ? "transport-headers" : "none";
  if (r) {
    const same = fromHeader.find((a) => a.name && isSmtp(a.email) && a.email.trim().toLowerCase() === r.email.toLowerCase());
    if (same) {
      name = same.name;
      nameSource = "transport-headers";
    }
    return { name, email: r.email, source: r.source, nameSource, dn: dnOf(p) };
  }
  return { name, email: null, source: "name-only", nameSource, dn: dnOf(p) };
}
function resolveRecipient(rc, ctx) {
  const headerName = rc.type === "cc" ? "Cc" : rc.type === "bcc" ? "Bcc" : "To";
  const list = headerList(ctx, headerName);
  let hdr = list.find((a) => isSmtp(a.email) && rc.name && norm(a.name) === norm(rc.name));
  if (!hdr && rc.name && isSmtp(rc.name.replace(/^'+|'+$/g, ""))) hdr = { email: rc.name.replace(/^'+|'+$/g, "") };
  const r = pick(
    { value: rc.smtp, source: "smtp-property" },
    { value: norm(rc.addrType) === "smtp" || !rc.addrType ? rc.email : null, source: "email-address-property" },
    { value: hdr && hdr.email, source: "transport-headers" },
    { value: rc.email && ctx.dnMap.get(norm(rc.email)), source: "dn-matched-in-message" },
    { value: rc.email, source: "email-address-property" }
  );
  const name = rc.name && rc.name.trim() || "";
  if (r) return { name, email: r.email, source: r.source, dn: dnOf(rc) };
  return { name, email: null, source: "name-only", dn: dnOf(rc) };
}

// src/rtf/decompress.js
var import_decompressrtf = __toESM(require_lib2(), 1);
var { decompressRTF } = import_decompressrtf.default;
var COMPRESSED = 1967544908;
var UNCOMPRESSED = 1095517517;
var CRC_TABLE = null;
function crcTable() {
  if (CRC_TABLE) return CRC_TABLE;
  CRC_TABLE = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
    CRC_TABLE[n] = c >>> 0;
  }
  return CRC_TABLE;
}
function rtfCrc(bytes, start = 0, end = bytes.length) {
  const t = crcTable();
  let crc = 0;
  for (let i = start; i < end; i++) crc = t[(crc ^ bytes[i]) & 255] ^ crc >>> 8;
  return crc >>> 0;
}
function decompressRtf(input) {
  const warnings = [];
  if (!input || input.length < 16) throw new Error("compressed RTF is shorter than its 16-byte header");
  const dv = new DataView(input.buffer, input.byteOffset, input.byteLength);
  const compSize = dv.getUint32(0, true);
  const rawSize = dv.getUint32(4, true);
  const compType = dv.getUint32(8, true);
  const crc = dv.getUint32(12, true);
  if (compType === UNCOMPRESSED) {
    const end = Math.min(input.length, 16 + rawSize);
    return { rtf: trimNulBytes(input.slice(16, end)), warnings };
  }
  if (compType !== COMPRESSED) throw new Error("compressed RTF has an unknown COMPTYPE");
  if (compSize < 12) throw new Error("compressed RTF COMPSIZE is too small");
  if (compSize + 4 > input.length) {
    throw new Error(`compressed RTF claims ${compSize + 4} bytes but the property holds ${input.length}`);
  }
  if (rawSize > compSize * 9 + 4096) throw new Error("compressed RTF RAWSIZE is implausible");
  const actual = rtfCrc(input, 16, compSize + 4);
  if (actual !== crc) warnings.push("The formatted body failed a check. It is shown as found and may contain errors.");
  const out = decompressRTF(input.subarray(0, compSize + 4));
  const len = Math.min(out.length, rawSize);
  if (out.length < rawSize) warnings.push("The formatted body is shorter than the file says. Some text may be missing.");
  const rtf = new Uint8Array(len);
  for (let i = 0; i < len; i++) rtf[i] = out[i] & 255;
  return { rtf: trimNulBytes(rtf), warnings };
}
function trimNulBytes(u8) {
  let end = u8.length;
  while (end > 0 && u8[end - 1] === 0) end--;
  return end === u8.length ? u8 : u8.subarray(0, end);
}

// src/rtf/rtf.js
init_codepage();
var BACKSLASH = 92;
var LBRACE = 123;
var RBRACE = 125;
var CR = 13;
var LF = 10;
var isLetter = (b) => b >= 97 && b <= 122 || b >= 65 && b <= 90;
var isDigit = (b) => b >= 48 && b <= 57;
var hexVal = (b) => {
  if (b >= 48 && b <= 57) return b - 48;
  if (b >= 97 && b <= 102) return b - 87;
  if (b >= 65 && b <= 70) return b - 55;
  return -1;
};
function tokenize(u8, emit) {
  const n = u8.length;
  let i = 0;
  while (i < n) {
    const c = u8[i];
    if (c === LBRACE) {
      emit({ t: "{" });
      i++;
      continue;
    }
    if (c === RBRACE) {
      emit({ t: "}" });
      i++;
      continue;
    }
    if (c === CR || c === LF) {
      i++;
      continue;
    }
    if (c === BACKSLASH) {
      i++;
      if (i >= n) break;
      const d = u8[i];
      if (isLetter(d)) {
        const start2 = i;
        while (i < n && isLetter(u8[i]) && i - start2 < 32) i++;
        let name = "";
        for (let k = start2; k < i; k++) name += String.fromCharCode(u8[k]);
        let param2 = null;
        if (i < n && (u8[i] === 45 || isDigit(u8[i]))) {
          let neg = false;
          if (u8[i] === 45) {
            neg = true;
            i++;
          }
          let v = 0;
          let digits = 0;
          while (i < n && isDigit(u8[i]) && digits < 10) {
            v = v * 10 + (u8[i] - 48);
            i++;
            digits++;
          }
          param2 = neg ? -v : v;
        }
        if (i < n && u8[i] === 32) i++;
        if (name === "bin" && param2 && param2 > 0) {
          const skip = Math.min(param2, n - i);
          emit({ t: "bin", n: skip });
          i += skip;
          continue;
        }
        emit({ t: "w", w: name, p: param2 });
        continue;
      }
      if (d === 39) {
        const h1 = i + 1 < n ? hexVal(u8[i + 1]) : -1;
        const h2 = i + 2 < n ? hexVal(u8[i + 2]) : -1;
        if (h1 >= 0 && h2 >= 0) {
          emit({ t: "x", b: h1 * 16 + h2 });
          i += 3;
        } else {
          i += 1;
        }
        continue;
      }
      if (d === CR || d === LF) {
        emit({ t: "w", w: "par", p: null });
        i++;
        continue;
      }
      emit({ t: "s", s: String.fromCharCode(d) });
      i++;
      continue;
    }
    const start = i;
    while (i < n) {
      const e = u8[i];
      if (e === BACKSLASH || e === LBRACE || e === RBRACE || e === CR || e === LF) break;
      i++;
    }
    emit({ t: "b", bytes: u8.subarray(start, i) });
  }
}
function detectEncapsulation(u8) {
  if (!u8 || u8.length < 6) return null;
  const head = String.fromCharCode(...u8.subarray(0, 6));
  if (head !== "{\\rtf1") return null;
  let count = 0;
  let result = null;
  let done = false;
  const STOP = {};
  try {
    tokenize(u8.subarray(0, Math.min(u8.length, 4096)), (tok) => {
      if (done) throw STOP;
      count++;
      if (tok.t === "w") {
        if (tok.w === "fromhtml") {
          result = "html";
          done = true;
        } else if (tok.w === "fromtext") {
          result = "text";
          done = true;
        }
      } else if (tok.t !== "{") {
        done = true;
      }
      if (count >= 10) done = true;
      if (done) throw STOP;
    });
  } catch (e) {
    if (e !== STOP) throw e;
  }
  return result;
}
var SKIP_DESTINATIONS = /* @__PURE__ */ new Set([
  "colortbl",
  "stylesheet",
  "info",
  "pict",
  "object",
  "objdata",
  "themedata",
  "colorschememapping",
  "datastore",
  "latentstyles",
  "listtable",
  "listoverridetable",
  "rsidtbl",
  "generator",
  "xmlnstbl",
  "header",
  "headerl",
  "headerr",
  "headerf",
  "footer",
  "footerl",
  "footerr",
  "footerf",
  "author",
  "operator",
  "title",
  "subject",
  "keywords",
  "comment",
  "doccomm",
  "creatim",
  "revtim",
  "printim",
  "buptim",
  "pntext",
  "pntxta",
  "pntxtb",
  "listtext",
  "fldinst",
  "filetbl",
  "revtbl",
  "pgdsctbl",
  "protusertbl",
  "xe",
  "tc",
  "txe",
  "bkmkstart",
  "bkmkend",
  "footnote",
  "annotation",
  "atnid",
  "atnauthor",
  "mmathPr",
  "nonshppict",
  "shppict",
  "shpinst",
  "sp",
  "sn",
  "sv",
  "template",
  "userprops",
  "wgrffmtfilter",
  "docvar",
  "factoidname",
  "ftnsep",
  "ftnsepc",
  "ftncn",
  "aftnsep",
  "aftnsepc",
  "aftncn",
  "fchars",
  "lchars"
]);
var CHAR_WORDS = new Map(Object.entries({
  lquote: "\u2018",
  rquote: "\u2019",
  ldblquote: "\u201C",
  rdblquote: "\u201D",
  bullet: "\u2022",
  endash: "\u2013",
  emdash: "\u2014",
  enspace: "\u2002",
  emspace: "\u2003",
  qmspace: "\u2005",
  zwj: "\u200D",
  zwnj: "\u200C",
  ltrmark: "\u200E",
  rtlmark: "\u200F"
}));
var CHAR_SYMBOLS = new Map(Object.entries({ "\\": "\\", "{": "{", "}": "}", "~": "\xA0", "_": "\xAD", "-": "\xAD" }));
function walk(u8, mode) {
  const out = [];
  let pending = [];
  let pendingCp = null;
  const flush = () => {
    if (pending.length) {
      out.push(decodeBytes(Uint8Array.from(pending), pendingCp || 1252));
      pending = [];
    }
  };
  const pushBytes = (bytes, cp) => {
    if (pendingCp !== cp) {
      flush();
      pendingCp = cp;
    }
    for (let k = 0; k < bytes.length; k++) pending.push(bytes[k]);
  };
  const pushText = (s) => {
    flush();
    out.push(s);
  };
  let defaultCp = 1252;
  let defaultFont = null;
  const fontCp = /* @__PURE__ */ new Map();
  let fontDefId = null;
  let st = { skip: false, fonttbl: false, htmltag: false, htmlrtf: false, font: null, uc: 1, first: false, star: false };
  const stack = [];
  let ucSkip = 0;
  let depth = 0;
  const cpForFont = (f) => {
    const id = f == null ? defaultFont : f;
    const cp = id == null ? void 0 : fontCp.get(id);
    return cp || defaultCp;
  };
  const suppressed = () => mode !== "plain" && !st.htmltag && st.htmlrtf;
  let ended = false;
  tokenize(u8, (tok) => {
    if (ended) return;
    if (tok.t === "{") {
      stack.push(st);
      st = { ...st, first: true, star: false };
      depth++;
      ucSkip = 0;
      return;
    }
    if (tok.t === "}") {
      if (stack.length) st = stack.pop();
      depth--;
      ucSkip = 0;
      if (depth <= 0) ended = true;
      return;
    }
    if (st.first) {
      if (tok.t === "s" && tok.s === "*") {
        st.star = true;
        return;
      }
      st.first = false;
      if (tok.t === "w") {
        const w = tok.w;
        if (w === "htmltag" && mode === "html" && !st.skip) {
          flush();
          st.htmltag = true;
          return;
        }
        if (st.star) {
          st.skip = true;
          return;
        }
        if (w === "fonttbl") {
          st.fonttbl = true;
          st.skip = true;
          return;
        }
        if (SKIP_DESTINATIONS.has(w)) {
          st.skip = true;
          return;
        }
      } else if (st.star) {
        st.skip = true;
      }
    }
    if (st.fonttbl) {
      if (tok.t === "w") {
        if (tok.w === "f" && tok.p != null) fontDefId = tok.p;
        else if (tok.w === "fcharset" && fontDefId != null && tok.p != null) {
          const cp2 = charsetToCodepage(tok.p);
          if (cp2 && !fontCp.has(fontDefId)) fontCp.set(fontDefId, cp2);
        } else if (tok.w === "cpg" && fontDefId != null && tok.p) fontCp.set(fontDefId, tok.p);
      }
      return;
    }
    if (tok.t === "w") {
      const w = tok.w;
      if (w === "ansicpg" && tok.p) {
        defaultCp = tok.p;
        return;
      }
      if (w === "ansi" && depth <= 1) {
        return;
      }
      if (w === "mac" && depth <= 1) {
        defaultCp = 1e4;
        return;
      }
      if (w === "pc" && depth <= 1) {
        defaultCp = 437;
        return;
      }
      if (w === "pca" && depth <= 1) {
        defaultCp = 850;
        return;
      }
      if (w === "deff" && tok.p != null) {
        defaultFont = tok.p;
        return;
      }
      if (w === "f" && tok.p != null) {
        st.font = tok.p;
        return;
      }
      if (w === "htmlrtf") {
        st.htmlrtf = tok.p !== 0;
        return;
      }
      if (w === "uc" && tok.p != null && tok.p >= 0) {
        st.uc = tok.p;
        return;
      }
      if (st.skip) return;
      if (w === "u" && tok.p != null) {
        if (suppressed()) {
          ucSkip = st.uc;
          return;
        }
        let code = tok.p;
        if (code < 0) code += 65536;
        pushText(String.fromCharCode(code & 65535));
        ucSkip = st.uc;
        return;
      }
      if (ucSkip > 0) {
        ucSkip--;
        return;
      }
      if (suppressed()) return;
      if (w === "par" || w === "line") {
        pushText("\r\n");
        return;
      }
      if (w === "tab") {
        pushText("	");
        return;
      }
      if (mode === "plain") {
        if (w === "row" || w === "page" || w === "sect") {
          pushText("\r\n");
          return;
        }
        if (w === "cell") {
          pushText("	");
          return;
        }
      }
      if (CHAR_WORDS.has(w)) {
        pushText(CHAR_WORDS.get(w));
        return;
      }
      return;
    }
    if (tok.t === "bin") return;
    if (st.skip) return;
    if (tok.t === "s") {
      if (ucSkip > 0) {
        ucSkip--;
        return;
      }
      if (suppressed()) return;
      const ch = CHAR_SYMBOLS.get(tok.s);
      if (ch !== void 0) pushText(ch);
      return;
    }
    const cp = st.htmltag ? defaultCp : cpForFont(st.font);
    if (tok.t === "x") {
      if (ucSkip > 0) {
        ucSkip--;
        return;
      }
      if (suppressed()) return;
      pushBytes([tok.b], cp);
      return;
    }
    if (tok.t === "b") {
      let bytes = tok.bytes;
      if (ucSkip > 0) {
        const k = Math.min(ucSkip, bytes.length);
        ucSkip -= k;
        bytes = bytes.subarray(k);
        if (!bytes.length) return;
      }
      if (suppressed()) return;
      pushBytes(bytes, cp);
    }
  });
  flush();
  return out.join("");
}
function deEncapsulate(rtf) {
  const kind = detectEncapsulation(rtf);
  if (!kind) return null;
  return { type: kind, content: walk(rtf, kind) };
}
function rtfToText(rtf) {
  return walk(rtf, "plain").replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

// src/ical.js
var MIN_1601_TO_1970 = 194074560;
var pad = (n, w = 2) => String(n).padStart(w, "0");
function icalSafe(s) {
  return String(s ?? "").replace(/[\x00-\x1f\x7f]+/g, " ").trim();
}
function icalText(s) {
  return String(s ?? "").replace(/[\x00-\x09\x0b\x0c\x0e-\x1f\x7f]/g, "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r\n|\r|\n/g, "\\n");
}
function foldLine(line) {
  const enc = new TextEncoder();
  const out = [];
  let cur = "";
  let curBytes = 0;
  let limit = 75;
  for (const ch of line) {
    const b = enc.encode(ch).length;
    if (curBytes + b > limit) {
      out.push(cur);
      cur = " ";
      curBytes = 1;
      limit = 75;
    }
    cur += ch;
    curBytes += b;
  }
  out.push(cur);
  return out.join("\r\n");
}
var utcStamp = (d) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
var localStamp = (d) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}`;
var dateStamp = (d) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;
var minutesToNaive = (min) => new Date((min - MIN_1601_TO_1970) * 6e4);
function nthWeekday(year, month, dayOfWeek, n, hour = 0, minute = 0) {
  if (n >= 5) {
    const last = new Date(Date.UTC(year, month, 0));
    const diff2 = (last.getUTCDay() - dayOfWeek + 7) % 7;
    return new Date(Date.UTC(year, month - 1, last.getUTCDate() - diff2, hour, minute));
  }
  const first = new Date(Date.UTC(year, month - 1, 1));
  const diff = (dayOfWeek - first.getUTCDay() + 7) % 7;
  return new Date(Date.UTC(year, month - 1, 1 + diff + (n - 1) * 7, hour, minute));
}
function ruleFor(tzdef, year) {
  if (!tzdef || !tzdef.rules || !tzdef.rules.length) return null;
  let best = null;
  for (const r of tzdef.rules) {
    const y = r.start ? new Date(r.start).getUTCFullYear() : 0;
    if (y <= year && (!best || y >= best._y)) best = { ...r, _y: y };
  }
  return best || tzdef.rules.find((r) => r.flags & 2) || tzdef.rules[0];
}
function makeZone(tzdef, year) {
  const rule = ruleFor(tzdef, year);
  if (!rule) return null;
  const std = -(rule.bias + rule.standardBias);
  const dst = -(rule.bias + rule.daylightBias);
  const hasDst = !!(rule.standardDate && rule.standardDate.month && rule.daylightDate && rule.daylightDate.month);
  const id = icalSafe(tzdef.keyName || "Custom").replace(/[";:,]/g, " ").trim().slice(0, 200) || "Custom";
  function transitions(y) {
    const sd = rule.standardDate;
    const dd = rule.daylightDate;
    const dstStartLocal = nthWeekday(y, dd.month, dd.dayOfWeek, dd.day, dd.hour, dd.minute);
    const stdStartLocal = nthWeekday(y, sd.month, sd.dayOfWeek, sd.day, sd.hour, sd.minute);
    return { dstStart: dstStartLocal.getTime() - std * 6e4, stdStart: stdStartLocal.getTime() - dst * 6e4 };
  }
  function offsetAt(utcMs) {
    if (!hasDst) return std;
    const y = new Date(utcMs + std * 6e4).getUTCFullYear();
    const t = transitions(y);
    const inDst = t.dstStart < t.stdStart ? utcMs >= t.dstStart && utcMs < t.stdStart : utcMs >= t.dstStart || utcMs < t.stdStart;
    return inDst ? dst : std;
  }
  const toLocal = (utc) => new Date(utc.getTime() + offsetAt(utc.getTime()) * 6e4);
  const toUtc = (naive) => {
    let t = naive.getTime() - std * 6e4;
    t = naive.getTime() - offsetAt(t) * 6e4;
    return new Date(t);
  };
  const fmtOff = (m) => `${m < 0 ? "-" : "+"}${pad(Math.floor(Math.abs(m) / 60))}${pad(Math.abs(m) % 60)}`;
  function vtimezone() {
    const L = ["BEGIN:VTIMEZONE", `TZID:${id}`];
    if (!hasDst) {
      L.push("BEGIN:STANDARD", "DTSTART:16010101T000000", `TZOFFSETFROM:${fmtOff(std)}`, `TZOFFSETTO:${fmtOff(std)}`, "END:STANDARD");
    } else {
      const sd = rule.standardDate;
      const dd = rule.daylightDate;
      const byday = (s) => `${s.day >= 5 ? -1 : s.day}${["SU", "MO", "TU", "WE", "TH", "FR", "SA"][s.dayOfWeek]}`;
      const s0 = nthWeekday(1970, sd.month, sd.dayOfWeek, sd.day, sd.hour, sd.minute);
      const d0 = nthWeekday(1970, dd.month, dd.dayOfWeek, dd.day, dd.hour, dd.minute);
      L.push(
        "BEGIN:STANDARD",
        `DTSTART:${localStamp(s0)}`,
        `RRULE:FREQ=YEARLY;BYMONTH=${sd.month};BYDAY=${byday(sd)}`,
        `TZOFFSETFROM:${fmtOff(dst)}`,
        `TZOFFSETTO:${fmtOff(std)}`,
        "END:STANDARD"
      );
      L.push(
        "BEGIN:DAYLIGHT",
        `DTSTART:${localStamp(d0)}`,
        `RRULE:FREQ=YEARLY;BYMONTH=${dd.month};BYDAY=${byday(dd)}`,
        `TZOFFSETFROM:${fmtOff(std)}`,
        `TZOFFSETTO:${fmtOff(dst)}`,
        "END:DAYLIGHT"
      );
    }
    L.push("END:VTIMEZONE");
    return L;
  }
  return { id, toLocal, toUtc, vtimezone };
}
var DAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
var bitsToDays = (bits) => DAYS.filter((_, i) => bits & 1 << i).join(",");
function rrule(recur, zone, warnings) {
  const p = recur && recur.recurrencePattern;
  if (!p) return null;
  if (p.calendarType && p.calendarType !== 1 && p.calendarType !== 2 && p.calendarType !== 0) {
    warnings.push("The repeat schedule could not be carried over (it uses a non-Gregorian calendar). The first occurrence is shown.");
    return null;
  }
  const parts = [];
  const yearly = p.recurFrequency === 8205;
  switch (p.patternType) {
    case 0:
      parts.push("FREQ=DAILY", `INTERVAL=${Math.max(1, Math.round(p.period / 1440))}`);
      break;
    case 1:
      parts.push("FREQ=WEEKLY", `INTERVAL=${Math.max(1, p.period)}`);
      if (p.patternTypeWeek) parts.push(`BYDAY=${bitsToDays(p.patternTypeWeek.dayOfWeekBits)}`);
      parts.push(`WKST=${DAYS[p.firstDOW] || "SU"}`);
      break;
    case 2:
    // Month
    case 4: {
      const day = p.patternType === 4 ? -1 : p.patternTypeMonth ? p.patternTypeMonth.day : 1;
      if (yearly) {
        parts.push("FREQ=YEARLY", `INTERVAL=${Math.max(1, Math.round(p.period / 12))}`);
        parts.push(`BYMONTH=${minutesToNaive(p.startDate).getUTCMonth() + 1}`);
      } else parts.push("FREQ=MONTHLY", `INTERVAL=${Math.max(1, p.period)}`);
      parts.push(`BYMONTHDAY=${day === 31 ? -1 : day}`);
      break;
    }
    case 3: {
      const nth = p.patternTypeMonthNth || { dayOfWeekBits: 0, n: 1 };
      if (yearly) {
        parts.push("FREQ=YEARLY", `INTERVAL=${Math.max(1, Math.round(p.period / 12))}`);
        parts.push(`BYMONTH=${minutesToNaive(p.startDate).getUTCMonth() + 1}`);
      } else parts.push("FREQ=MONTHLY", `INTERVAL=${Math.max(1, p.period)}`);
      parts.push(`BYDAY=${bitsToDays(nth.dayOfWeekBits)}`, `BYSETPOS=${nth.n >= 5 ? -1 : nth.n}`);
      break;
    }
    default:
      warnings.push(`The repeat schedule could not be carried over (pattern type ${p.patternType}). The first occurrence is shown.`);
      return null;
  }
  if (p.endType === 8226 && p.occurrenceCount > 0) parts.push(`COUNT=${p.occurrenceCount}`);
  else if (p.endType === 8225 && p.endDate) {
    const lastLocal = minutesToNaive(p.endDate + (recur.startTimeOffset || 0));
    const until = zone ? zone.toUtc(lastLocal) : lastLocal;
    parts.push(`UNTIL=${utcStamp(until)}`);
  }
  return parts.join(";");
}
function buildCalendar(m, people, warnings) {
  const a = m.appointment;
  if (!a || !a.start) return null;
  const cls = m.messageClass || "";
  let method = "PUBLISH";
  let status = null;
  let partstat = null;
  if (/^IPM\.Schedule\.Meeting\.Request/i.test(cls)) method = "REQUEST";
  else if (/^IPM\.Schedule\.Meeting\.Canceled/i.test(cls)) {
    method = "CANCEL";
    status = "CANCELLED";
  } else if (/^IPM\.Schedule\.Meeting\.Resp\.Pos/i.test(cls)) {
    method = "REPLY";
    partstat = "ACCEPTED";
  } else if (/^IPM\.Schedule\.Meeting\.Resp\.Neg/i.test(cls)) {
    method = "REPLY";
    partstat = "DECLINED";
  } else if (/^IPM\.Schedule\.Meeting\.Resp\.Tent/i.test(cls)) {
    method = "REPLY";
    partstat = "TENTATIVE";
  }
  const start = a.start;
  const end = a.end && a.end >= a.start ? a.end : a.start;
  const tzdef = a.recur ? a.tzRecur || a.tzStart : a.tzStart;
  const zone = tzdef ? makeZone(tzdef, start.getUTCFullYear()) : null;
  const L = ["BEGIN:VCALENDAR", "PRODID:-//msg-eml-core//EN", "VERSION:2.0", `METHOD:${method}`];
  if (zone) L.push(...zone.vtimezone());
  const allDay = zone && (() => {
    const ls = zone.toLocal(start);
    const le = zone.toLocal(end);
    const midnight = (d) => d.getUTCHours() === 0 && d.getUTCMinutes() === 0 && d.getUTCSeconds() === 0;
    return midnight(ls) && midnight(le) && end > start && (le - ls) % 864e5 === 0;
  })();
  const dt = (name, d) => {
    if (allDay) return `${name};VALUE=DATE:${dateStamp(zone.toLocal(d))}`;
    if (zone) return `${name};TZID=${zone.id}:${localStamp(zone.toLocal(d))}`;
    return `${name}:${utcStamp(d)}`;
  };
  const stamp = m.dates.submit || m.dates.creation || m.dates.modification || start;
  const uidSrc = icalSafe(a.globalId || (m.messageId ? String(m.messageId).replace(/[<>]/g, "") : "")).replace(/\s+/g, "");
  const uid = uidSrc || `${utcStamp(start)}-${(m.subject || "").length}@msg-eml-core`;
  const event = (extra) => {
    const E = ["BEGIN:VEVENT", `UID:${uid}`, `DTSTAMP:${utcStamp(stamp)}`];
    E.push(...extra);
    return E;
  };
  const main = [dt("DTSTART", start), dt("DTEND", end)];
  if (m.subject) main.push(`SUMMARY:${icalText(m.subject)}`);
  if (a.location) main.push(`LOCATION:${icalText(a.location)}`);
  if (people.body && people.body.trim()) main.push(`DESCRIPTION:${icalText(people.body)}`);
  if (status) main.push(`STATUS:${status}`);
  const cn = (p) => {
    const n = icalSafe(p.name).replace(/"/g, "'");
    return n ? `;CN="${n}"` : "";
  };
  const mailto = (p) => `mailto:${icalSafe(p.email).replace(/\s+/g, "")}`;
  if (method === "REPLY") {
    const org = people.attendees.find((at) => at.email && at.type !== "cc" && at.type !== "bcc");
    if (org) main.push(`ORGANIZER${cn(org)}:${mailto(org)}`);
    else warnings.push("The meeting organizer is not in the file.");
    if (people.organizer && people.organizer.email) {
      main.push(`ATTENDEE${cn(people.organizer)};PARTSTAT=${partstat}:${mailto(people.organizer)}`);
    }
  } else {
    if (people.organizer && people.organizer.email) main.push(`ORGANIZER${cn(people.organizer)}:${mailto(people.organizer)}`);
    for (const at of people.attendees) {
      if (!at.email) continue;
      const role = at.type === "cc" ? "OPT-PARTICIPANT" : at.type === "bcc" ? "NON-PARTICIPANT" : "REQ-PARTICIPANT";
      const rsvp = method === "REQUEST" ? ";RSVP=TRUE" : "";
      main.push(`ATTENDEE${cn(at)};ROLE=${role};PARTSTAT=NEEDS-ACTION${rsvp}:${mailto(at)}`);
    }
  }
  if (a.recur) {
    const r = rrule(a.recur, zone, warnings);
    if (r) {
      main.push(`RRULE:${r}`);
      const p = a.recur.recurrencePattern;
      const modified = new Set(p.modifiedInstanceDates || []);
      for (const dmin of p.deletedInstanceDates || []) {
        if (modified.has(dmin)) continue;
        const local = minutesToNaive(dmin + (a.recur.startTimeOffset || 0));
        main.push(allDay ? `EXDATE;VALUE=DATE:${dateStamp(local)}` : zone ? `EXDATE;TZID=${zone.id}:${localStamp(local)}` : `EXDATE:${utcStamp(local)}`);
      }
    }
  }
  L.push(...event(main), "END:VEVENT");
  if (a.recur && a.recur.exceptionInfo && zone && !allDay) {
    for (const ex of a.recur.exceptionInfo) {
      const s = minutesToNaive(ex.startDateTime);
      const e = minutesToNaive(ex.endDateTime);
      const o = minutesToNaive(ex.originalStartTime);
      const X = [`RECURRENCE-ID;TZID=${zone.id}:${localStamp(o)}`, `DTSTART;TZID=${zone.id}:${localStamp(s)}`, `DTEND;TZID=${zone.id}:${localStamp(e)}`];
      X.push(`SUMMARY:${icalText(ex.subject != null ? ex.subject : m.subject || "")}`);
      if (ex.location != null || a.location) X.push(`LOCATION:${icalText(ex.location != null ? ex.location : a.location)}`);
      L.push(...event(X), "END:VEVENT");
    }
  }
  L.push("END:VCALENDAR");
  return { ics: L.map(foldLine).join("\r\n") + "\r\n", method };
}

// src/vcard.js
var esc = (s) => String(s ?? "").replace(/[\x00-\x09\x0b\x0c\x0e-\x1f\x7f]/g, "").replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\r\n|\r|\n/g, "\\n");
function contactVcard(c) {
  const fn = c.email1DisplayName && !/@/.test(c.email1DisplayName) ? c.email1DisplayName : [c.displayNamePrefix, c.givenName, c.middleName, c.surname, c.generation].filter(Boolean).join(" ") || c.fileUnder || c.subject || "";
  if (!fn && !c.email1EmailAddress) return null;
  const L = ["BEGIN:VCARD", "VERSION:4.0", `FN:${esc(fn || c.email1EmailAddress)}`];
  L.push(`N:${[c.surname, c.givenName, c.middleName, c.displayNamePrefix, c.generation].map(esc).join(";")}`);
  if (c.companyName || c.departmentName || c.department) L.push(`ORG:${esc(c.companyName)}${c.departmentName || c.department ? ";" + esc(c.departmentName || c.department) : ""}`);
  if (c.title) L.push(`TITLE:${esc(c.title)}`);
  if (c.email1EmailAddress && /@/.test(c.email1EmailAddress)) L.push(`EMAIL;TYPE=work:${esc(c.email1EmailAddress)}`);
  const tel = (type, v) => v && L.push(`TEL;TYPE=${type}:${esc(v)}`);
  tel("work,voice", c.businessTelephoneNumber);
  tel("home,voice", c.homeTelephoneNumber);
  tel("cell", c.mobileTelephoneNumber);
  tel("work,fax", c.businessFaxNumber);
  const adr = (type, street, city, region, code, country) => {
    if (street || city || region || code || country) L.push(`ADR;TYPE=${type}:;;${[street, city, region, code, country].map(esc).join(";")}`);
  };
  adr("work", c.workAddressStreet, c.workAddressCity, c.workAddressState, c.workAddressPostalCode, c.workAddressCountry);
  adr("home", c.streetAddress, c.addressCity, c.stateOrProvince, c.postalCode, c.country);
  if (c.businessHomePage) L.push(`URL:${esc(c.businessHomePage)}`);
  if (c.body) L.push(`NOTE:${esc(c.body)}`);
  L.push("END:VCARD");
  const base = (fn || "contact").replace(/[\\/:*?"<>|\r\n]+/g, "_").slice(0, 80);
  return { text: L.map(foldLine).join("\r\n") + "\r\n", filename: `${base}.vcf` };
}

// src/convert.js
var MIME_BY_EXT = new Map(Object.entries({
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  bmp: "image/bmp",
  tif: "image/tiff",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  webp: "image/webp",
  txt: "text/plain",
  htm: "text/html",
  html: "text/html",
  csv: "text/csv",
  rtf: "application/rtf",
  xml: "application/xml",
  json: "application/json",
  zip: "application/zip",
  eml: "message/rfc822",
  ics: "text/calendar",
  vcf: "text/vcard",
  doc: "application/msword",
  xls: "application/vnd.ms-excel",
  ppt: "application/vnd.ms-powerpoint",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  msg: "application/vnd.ms-outlook",
  mp3: "audio/mpeg",
  mp4: "video/mp4",
  wav: "audio/wav"
}));
var TOKEN = /^[A-Za-z0-9!#$%&'*+.^_`|~-]+$/;
function mimeTypeFor(att) {
  const tag = (att.mime || "").trim().toLowerCase();
  const m = /^([a-z0-9!#$&^_.+-]+)\/([a-z0-9!#$&^_.+-]+)$/.exec(tag);
  if (m && !tag.startsWith("multipart/") && tag !== "message/rfc822") return tag;
  const ext = (att.filename.split(".").pop() || att.extension.replace(/^\./, "") || "").toLowerCase();
  const t = MIME_BY_EXT.get(ext);
  return t && t !== "message/rfc822" ? t : "application/octet-stream";
}
var DAYS2 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var pad2 = (n) => String(n).padStart(2, "0");
function rfc5322Date(d) {
  return `${DAYS2[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()} ${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}:${pad2(d.getUTCSeconds())} +0000`;
}
var DATE_RE = /^(?:(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), ?)?\d{1,2} (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4} \d{2}:\d{2}(?::\d{2})? [+-]\d{4}(?: \([^()]*\))?$/;
function chooseDate(m, hdrs) {
  const raw = headerValue(hdrs, "Date");
  const h = raw && raw.length < 200 ? raw.replace(/\s+/g, " ").trim() : null;
  if (h && DATE_RE.test(h)) {
    const value = h.replace(/ \([^()]*\)$/, "");
    const parsed = new Date(value);
    if (!isNaN(parsed) && (!m.dates.submit || Math.abs(parsed - m.dates.submit) < 36 * 3600 * 1e3)) {
      return { value, source: "transport-headers" };
    }
  }
  for (const [k, src] of [["submit", "PidTagClientSubmitTime"], ["delivery", "PidTagMessageDeliveryTime"], ["creation", "PidTagCreationTime"], ["modification", "PidTagLastModificationTime"]]) {
    const d = m.dates[k];
    if (d && d.getUTCFullYear() > 1601 && d.getUTCFullYear() < 4500) return { value: rfc5322Date(d), source: src };
  }
  return { value: null, source: "none" };
}
var MSG_ID = /^[\x21-\x3b\x3d\x3f-\x7e]+@[\x21-\x3b\x3d\x3f-\x7e]+$/;
function msgIdValue(v) {
  if (!v) return null;
  const s = stripTrailingNul(String(v)).trim();
  const inner = s.startsWith("<") && s.endsWith(">") ? s.slice(1, -1) : s;
  if (inner.length > 900 || !MSG_ID.test(inner)) return null;
  return `<${inner}>`;
}
function msgIdList(v) {
  if (!v) return null;
  const ids = [];
  for (const tok of String(v).split(/[\s,]+/)) {
    if (!tok) continue;
    const id = msgIdValue(tok);
    if (id) ids.push(id);
  }
  return ids.length ? ids.join(" ") : null;
}
var UNRESOLVED_DOMAIN = "unresolved.invalid";
var UNRESOLVED_ADDRESS = `unresolved@${UNRESOLVED_DOMAIN}`;
function fnv1a(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}
function unresolvedPlaceholder(p) {
  const slug = String(p.name || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "").slice(0, 40).replace(/\.+$/, "");
  const key = (p.dn || p.name || "").trim().toLowerCase();
  return `${slug || "unresolved"}.${fnv1a(key)}@${UNRESOLVED_DOMAIN}`;
}
var DOT_ATOM = /^[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+)*$/;
var ASCII_DOMAIN = /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.?$|^\[[\x21-\x5a\x5e-\x7e]+\]$/;
function toAsciiDomain(domain) {
  if (!/[^\x00-\x7f]/.test(domain)) return ASCII_DOMAIN.test(domain) ? domain : null;
  try {
    const host = new URL(`http://${domain}/`).hostname;
    return host && ASCII_DOMAIN.test(host) ? host : null;
  } catch {
    return null;
  }
}
function headerAddrSpec(addr, utf8Headers = false) {
  const a = String(addr || "").trim();
  const at = a.lastIndexOf("@");
  if (at <= 0 || at === a.length - 1 || /[\x00-\x20\x7f]/.test(a)) return null;
  let local = a.slice(0, at);
  const domain = a.slice(at + 1);
  const nonAsciiLocal = /[^\x00-\x7f]/.test(local);
  if (nonAsciiLocal) {
    if (!utf8Headers || /["\\]/.test(local)) return null;
    const d2 = /[^\x00-\x7f]/.test(domain) ? domain.normalize("NFC") : toAsciiDomain(domain);
    return d2 ? `${local.normalize("NFC")}@${d2}` : null;
  }
  if (!DOT_ATOM.test(local)) {
    if (/[^\x20-\x7e]/.test(local)) return null;
    local = `"${local.replace(/(["\\])/g, "\\$1")}"`;
  }
  const d = toAsciiDomain(domain);
  return d ? `${local}@${d}` : null;
}
function makeFormatter(opts, warnings) {
  const mode = opts.unresolvedAddress || "invalid-domain";
  const utf82 = !!opts.utf8Headers;
  const warned = /* @__PURE__ */ new Set();
  return (p) => {
    let email = null;
    if (p.email) {
      email = headerAddrSpec(p.email, utf82);
      if (!email && !warned.has(p.email)) {
        warned.add(p.email);
        warnings.push(`The address ${JSON.stringify(p.email)} has characters that a mail header cannot carry. It is shown with a placeholder address.`);
      }
    }
    if (email) return p.name ? `${phrase(p.name)} <${email}>` : email;
    const name = p.name || (p.email ? String(p.email) : "");
    if (!name) return null;
    if (mode === "invalid-domain") return `${phrase(name)} <${unresolvedPlaceholder({ name, dn: p.dn })}>`;
    const ph = phrase(name);
    return ph.endsWith("?=") ? `${ph} :;` : `${ph}:;`;
  };
}
var GENERATED = /* @__PURE__ */ new Set([
  "from",
  "sender",
  "to",
  "cc",
  "bcc",
  "subject",
  "date",
  "message-id",
  "in-reply-to",
  "references",
  "mime-version",
  "importance",
  "x-priority",
  "sensitivity"
]);
var UNSAFE = /* @__PURE__ */ new Set([
  "disposition-notification-to",
  "return-receipt-to",
  "x-confirm-reading-to",
  "generate-delivery-report",
  "read-receipt-to"
]);
var ADDRESS_HEADERS = /* @__PURE__ */ new Set([
  "reply-to",
  "mail-reply-to",
  "mail-followup-to",
  "resent-from",
  "resent-sender",
  "resent-to",
  "resent-cc",
  "resent-bcc",
  "errors-to",
  "return-path"
]);
function addressListValue(value, fmt) {
  const list = parseAddressList(value).filter((a) => isSmtp(a.email)).map((a) => fmt({ name: a.name, email: a.email.trim() }));
  const kept = list.filter((x) => x && !x.endsWith(":;"));
  return kept.length ? kept.join(", ") : null;
}
function replayHeaders(hdrs, fmt, warnings) {
  const out = [];
  for (const [k, v] of hdrs) {
    const lk = k.toLowerCase();
    if (GENERATED.has(lk) || UNSAFE.has(lk) || lk.startsWith("content-") || lk.startsWith("x-mozilla-")) continue;
    if (!TOKEN.test(k) || k.length > 76) continue;
    if (ADDRESS_HEADERS.has(lk)) {
      if (lk === "return-path") {
        const inner = v.trim().replace(/^<|>$/g, "").trim();
        const spec = inner === "" ? "" : headerAddrSpec(inner, false);
        if (spec !== null && (inner === "" || isSmtp(inner))) out.push([k, `<${spec}>`]);
        continue;
      }
      const val = addressListValue(v, fmt);
      if (val) out.push([k, val]);
      else warnings.push(`The original ${k} line has no usable address and was left out.`);
      continue;
    }
    out.push([k, unstructured(v)]);
  }
  return out;
}
function htmlCharsetToUtf8(html) {
  const lower = html.replace(/[A-Z]+/g, (c) => c.toLowerCase());
  let out = "";
  let pos = 0;
  for (; ; ) {
    const start = lower.indexOf("<meta", pos);
    if (start < 0) break;
    const end = lower.indexOf(">", start);
    if (end < 0) break;
    const tag = html.slice(start, end);
    const fixed = tag.length > 2048 ? tag : tag.replace(/(\bcharset[ \t\r\n]*=[ \t\r\n]*["']?)[A-Za-z0-9_\-:.]+/i, "$1utf-8");
    out += html.slice(pos, start) + fixed;
    pos = end;
  }
  return pos === 0 ? html : out + html.slice(pos);
}
var SMIME_OIDS = [
  // contentType OIDs in DER (06 len value), RFC 5652 / RFC 8551
  { der: [6, 9, 42, 134, 72, 134, 247, 13, 1, 7, 2], type: "signed-data" },
  { der: [6, 9, 42, 134, 72, 134, 247, 13, 1, 7, 3], type: "enveloped-data" },
  { der: [6, 11, 42, 134, 72, 134, 247, 13, 1, 9, 16, 1, 23], type: "authEnveloped-data" },
  { der: [6, 11, 42, 134, 72, 134, 247, 13, 1, 9, 16, 1, 9], type: "compressed-data" }
];
function smimeType(data, mimeTag) {
  const m = /smime-type\s*=\s*"?([A-Za-z-]+)/i.exec(mimeTag || "");
  if (m) {
    const t = SMIME_OIDS.find((o) => o.type.toLowerCase() === m[1].toLowerCase());
    if (t) return t.type;
  }
  if (!data || data.length < 16 || data[0] !== 48) return null;
  let i = 2;
  if (data[1] & 128) i = 2 + (data[1] & 127);
  if (i > 6) return null;
  for (const o of SMIME_OIDS) {
    if (o.der.every((b, k) => data[i + k] === b)) return o.type;
  }
  return null;
}
function cidReferenced(lowerHtml, cid) {
  const needle = `cid:${cid.toLowerCase()}`;
  let at = lowerHtml.indexOf(needle);
  while (at >= 0) {
    const next = lowerHtml.charCodeAt(at + needle.length);
    if (Number.isNaN(next) || /[\s"'()<>\\]/.test(String.fromCharCode(next))) return true;
    at = lowerHtml.indexOf(needle, at + 1);
  }
  return false;
}
var cleanForReport = (s) => String(s).replace(/[\x00-\x1f\x7f]+/g, " ").slice(0, 120);
function buildEml(m, opts = {}, depth = 0) {
  const keepRtf = opts.keepRtf ?? "auto";
  const ser = { utf8: !!opts.utf8Headers };
  const warnings = [...m.warnings];
  const report = { messageClass: m.messageClass, codepage: m.codepage, warnings, body: {}, addresses: {}, attachments: [] };
  const hdrs = parseHeaderBlock(m.transportHeaders);
  const ctx = { headers: hdrs, dnMap: buildDnMap(m) };
  const headers = [];
  const rep = m.representing;
  const hasRep = !!(rep.name || rep.email || rep.smtp);
  const norm2 = (x) => String(x || "").trim().toLowerCase();
  const onBehalf = hasRep && (rep.name && norm2(rep.name) !== norm2(m.sender.name) || rep.email && m.sender.email && norm2(rep.email) !== norm2(m.sender.email));
  const sender = onBehalf ? resolvePerson(m.sender, ctx, "Sender", { author: true }) : resolvePerson(m.sender, ctx, "From", { author: true });
  let from = sender;
  if (hasRep) {
    const r = resolvePerson(rep, ctx, "From", { author: true });
    if (r.email || r.name) from = r;
  }
  report.addresses.from = { name: from.name, email: from.email, source: from.source, nameSource: from.nameSource };
  const fmt = makeFormatter(opts, warnings);
  const fromStr = fmt(from);
  if (fromStr) headers.push(["From", fromStr]);
  if (from.email && sender.email && from.email.toLowerCase() !== sender.email.toLowerCase()) {
    headers.push(["Sender", fmt(sender)]);
  }
  if (fromStr && !from.email) warnings.push(`The file has no email address for the sender (${from.name}). From shows ${(opts.unresolvedAddress || "invalid-domain") === "name-only" ? "the name only" : "a placeholder address ending in @unresolved.invalid"}. A reply will not reach them.`);
  const people = { to: [], cc: [], bcc: [] };
  let unresolved = 0;
  for (const rc of m.recipients) {
    const r = resolveRecipient(rc, ctx);
    if (!r.email && !r.name) {
      warnings.push("One recipient had no name or email address and was left out.");
      continue;
    }
    if (!r.email) unresolved++;
    (people[rc.type] || people.to).push({ ...r, type: rc.type });
  }
  if (unresolved) {
    const nameOnly = (opts.unresolvedAddress || "invalid-domain") === "name-only";
    warnings.push(`${unresolved === 1 ? "1 recipient has" : `${unresolved} recipients have`} no email address in the file. ${unresolved === 1 ? "It is" : "They are"} shown ${nameOnly ? "by name only" : "with a placeholder address ending in @unresolved.invalid"}.`);
  }
  report.addresses.recipients = [...people.to, ...people.cc, ...people.bcc].map((p) => ({ type: p.type, name: p.name, email: p.email, source: p.source }));
  for (const [key, hn] of [["to", "To"], ["cc", "Cc"]]) {
    const list = people[key].map(fmt).filter(Boolean);
    if (list.length) headers.push([hn, list.join(", ")]);
    else if (!m.recipients.length) {
      const hv = headerValue(hdrs, hn);
      const val = hv ? addressListValue(hv, fmt) : null;
      if (val) headers.push([hn, val]);
    }
  }
  if (people.bcc.length) headers.push(["Bcc", people.bcc.map(fmt).filter(Boolean).join(", ")]);
  if (m.subject != null && m.subject !== "") headers.push(["Subject", unstructured(m.subject)]);
  else if (m.subject === "") headers.push(["Subject", ""]);
  const date = chooseDate(m, hdrs);
  report.date = date;
  if (date.value) headers.push(["Date", date.value]);
  else warnings.push("The file has no date, so no date is shown.");
  const mid = msgIdValue(m.messageId) || msgIdValue(headerValue(hdrs, "Message-ID"));
  if (mid) headers.push(["Message-ID", mid]);
  const irt = msgIdList(m.inReplyTo) || msgIdList(headerValue(hdrs, "In-Reply-To"));
  if (irt) headers.push(["In-Reply-To", irt]);
  const refs = msgIdList(m.references) || msgIdList(headerValue(hdrs, "References"));
  if (refs) headers.push(["References", refs]);
  if (m.importance === 2) headers.push(["Importance", "high"], ["X-Priority", "1"]);
  else if (m.importance === 0) headers.push(["Importance", "low"], ["X-Priority", "5"]);
  if (m.sensitivity === 1) headers.push(["Sensitivity", "Personal"]);
  else if (m.sensitivity === 2) headers.push(["Sensitivity", "Private"]);
  else if (m.sensitivity === 3) headers.push(["Sensitivity", "Company-Confidential"]);
  if (opts.replayHeaders !== false) headers.push(...replayHeaders(hdrs, fmt, warnings));
  if (m.messageClass) headers.push(["X-MS-Message-Class", unstructured(m.messageClass)]);
  const cls = m.messageClass || "";
  if (/^IPM\.Note\.SMIME/i.test(cls) && m.attachments.length >= 1 && m.attachments[0].data) {
    const att = m.attachments[0];
    if (/^IPM\.Note\.SMIME\.MultipartSigned/i.test(cls)) {
      const text2 = new TextDecoder("latin1").decode(att.data.subarray(0, 4096));
      if (/^content-type:\s*multipart\/signed/im.test(text2)) {
        report.body = { kind: "smime-signed", htmlProperty: !!m.htmlProperty, note: "original signed MIME entity passed through unchanged" };
        return { bytes: serializeMessage(headers, Part.rawEntity(att.data), depth, ser), report };
      }
      warnings.push("This is a signed message. It opens as an ordinary message with the signed content attached, and the signature cannot be checked.");
    } else {
      const st = smimeType(att.data, att.mime);
      const fname = att.filename || "smime.p7m";
      const p = Part.binary("application/pkcs7-mime", att.data, { filename: /\.p7[mz]$/i.test(fname) ? fname : "smime.p7m" });
      if (st) p.params.unshift(["smime-type", st]);
      else warnings.push("The message's encryption or signature type was not recognised. It may not open correctly.");
      report.body = { htmlProperty: !!m.htmlProperty, kind: st === "signed-data" ? "smime-opaque-signed" : st === "enveloped-data" || st === "authEnveloped-data" ? "smime-encrypted" : "smime-unknown", smimeType: st };
      return { bytes: serializeMessage(headers, p, depth, ser), report };
    }
  }
  let text = m.body && m.body.length ? m.body : null;
  let html = m.html || null;
  let rtfBytes = null;
  let rtfKind = null;
  report.body.textSource = text ? "PidTagBody" : null;
  report.body.htmlSource = html ? "PidTagHtml" : null;
  report.body.htmlProperty = !!m.htmlProperty;
  if (m.compressedRtf && m.compressedRtf.length) {
    try {
      const r = decompressRtf(m.compressedRtf);
      warnings.push(...r.warnings);
      rtfBytes = r.rtf;
      rtfKind = detectEncapsulation(rtfBytes) || "rtf";
      report.body.rtf = rtfKind;
      if (rtfKind === "html" && !html) {
        html = stripTrailingNul(deEncapsulate(rtfBytes).content);
        report.body.htmlSource = "RTF (de-encapsulated)";
      } else if (rtfKind === "text" && !text) {
        text = stripTrailingNul(deEncapsulate(rtfBytes).content);
        report.body.textSource = "RTF (de-encapsulated)";
      } else if (rtfKind === "rtf" && !text && !html) {
        text = rtfToText(rtfBytes);
        report.body.textSource = "RTF (converted to plain text)";
      }
    } catch (e) {
      warnings.push(`The formatted body could not be read (${e && e.message ? e.message : e}). Some text may be missing.`);
    }
  }
  if (html) html = htmlCharsetToUtf8(html);
  let calendar = null;
  if (/^IPM\.(Appointment|Schedule\.Meeting)/i.test(cls)) {
    const organizer = from.email ? from : sender.email ? sender : null;
    calendar = buildCalendar(m, { organizer, attendees: [...people.to, ...people.cc, ...people.bcc], body: text || "" }, warnings);
    if (!calendar) warnings.push("This calendar item has no start time, so no calendar file was attached.");
  }
  let vcard = null;
  if (m.contact) vcard = contactVcard(m.contact);
  const cidRefs = html ? html.toLowerCase() : "";
  const related = [];
  const attached = [];
  for (const att of m.attachments) {
    const name = att.filename || att.displayName || "";
    if (att.error) {
      warnings.push(`The attachment "${name || att.index}" was left out (${att.error}).`);
      report.attachments.push({ name, skipped: att.error });
      continue;
    }
    if (att.embedded) {
      const inner = buildEml(att.embedded, opts, depth + 1);
      const fname = (name || att.embedded.subject || "message").replace(/\.msg$/i, "") + ".eml";
      attached.push(Part.message(inner.bytes, { filename: fname }));
      report.attachments.push({ name: fname, type: "message/rfc822", embedded: inner.report });
      continue;
    }
    const type = mimeTypeFor(att);
    let cid = null;
    if (att.cid) {
      const c = stripTrailingNul(String(att.cid)).trim();
      const inner = c.startsWith("<") && c.endsWith(">") ? c.slice(1, -1) : c;
      if (isValidCid(inner)) cid = inner;
      else warnings.push(`The inline attachment "${cleanForReport(name || att.index)}" could not be placed in the text, so it is attached as an ordinary file.`);
    }
    const referenced = cid && cidReferenced(cidRefs, cid);
    if (referenced) {
      related.push(Part.binary(type, att.data, { filename: name || void 0, cid, inline: true }));
      report.attachments.push({ name, type, inline: true, cid, size: att.data.length });
    } else {
      attached.push(Part.binary(type, att.data, { filename: name || `attachment-${att.index + 1}`, cid: cid || void 0 }));
      report.attachments.push({ name, type, size: att.data.length });
    }
  }
  const rtfUseful = rtfKind === "rtf" && rtfBytes && !html && rtfToText(rtfBytes).trim().length > 0;
  if (rtfKind === "rtf" && rtfBytes && (keepRtf === "always" || keepRtf === "auto" && rtfUseful)) {
    attached.push(Part.binary("application/rtf", rtfBytes, { filename: "body.rtf", description: "Original RTF body" }));
    report.attachments.push({ name: "body.rtf", type: "application/rtf", generated: true });
    report.body.rtfKept = true;
  }
  if (vcard) {
    attached.push(Part.binary("text/vcard", new TextEncoder().encode(vcard.text), { filename: vcard.filename, description: "Contact" }));
    report.attachments.push({ name: vcard.filename, type: "text/vcard", generated: true });
  }
  if (!text && !html && !calendar) text = "";
  if (!text && html === null && calendar) text = "";
  const alts = [];
  if (text !== null) alts.push(Part.text("plain", text));
  if (html) {
    const htmlPart = Part.text("html", html);
    alts.push(related.length ? Part.multipart("related", [htmlPart, ...related], [["type", '"text/html"']]) : htmlPart);
  } else if (related.length) {
    attached.unshift(...related);
  }
  if (calendar) alts.push(Part.text("calendar", calendar.ics, { method: calendar.method }));
  let body = alts.length === 1 ? alts[0] : Part.multipart("alternative", alts);
  if (attached.length) body = Part.multipart("mixed", [body, ...attached]);
  report.body.parts = { text: text !== null, html: !!html, calendar: !!calendar, inline: related.length };
  return { bytes: serializeMessage(headers, body, depth, ser), report };
}

// src/index.js
function convertMsgToEml(msgBytes, options = {}) {
  let model;
  try {
    model = readMsg(msgBytes, options);
  } catch (e) {
    if (e instanceof MsgError) throw e;
    throw new MsgError("UNREADABLE", `The file could not be read as an Outlook message (${e && e.message ? e.message : e}).`, e);
  }
  try {
    const { bytes, report } = buildEml(model, options);
    return { eml: bytes, report };
  } catch (e) {
    if (e instanceof MsgError) throw e;
    throw new MsgError("UNREADABLE", `The message could not be converted (${e && e.message ? e.message : e}).`, e);
  }
}
export {
  MsgError,
  buildEml,
  convertMsgToEml,
  deEncapsulate,
  decompressRtf,
  detectEncapsulation,
  readMsg,
  rtfToText
};
