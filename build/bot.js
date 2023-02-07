"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const booru = __importStar(require("booru"));
const cron_1 = require("cron");
const fs_1 = require("fs");
let mikuJob = new cron_1.CronJob('*/10 * * * * *', mikuSearch, null, true, 'Europe/Madrid');
mikuJob.start();
function mikuSearch() {
    return __awaiter(this, void 0, void 0, function* () {
        const posts = yield booru.search('safebooru', ["hatsune_miku"], { limit: 1, random: true });
        for (let post of posts) {
            console.log(post.fileUrl);
            yield downloadImage(post.fileUrl, `pics/${post.id}.jpg`);
        }
    });
}
const downloadImage = (url, path) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(url);
    const blob = yield response.blob();
    const arrayBuffer = yield blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    yield fs_1.promises.writeFile(path, buffer);
    console.log('Image saved.');
});
