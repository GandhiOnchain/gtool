const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/add-2PZ3Kr9N.js","assets/lit-COTpoEUt.js","assets/all-wallets-BbndLtmM.js","assets/arrow-bottom-circle-czucrzps.js","assets/app-store-Bd0wNYp3.js","assets/apple-GLk4yeZX.js","assets/arrow-bottom-DfQv1Xt6.js","assets/arrow-left-CCBO1FnC.js","assets/arrow-right-skjycKFt.js","assets/arrow-top-BWrCtgAI.js","assets/bank-CtT5O10Q.js","assets/browser-DwyeaVB6.js","assets/card-D5yw6jr6.js","assets/checkmark-YGfe1m4b.js","assets/checkmark-bold-Cv_cSVBi.js","assets/chevron-bottom-DaCRl5iA.js","assets/chevron-left-DxncEX3j.js","assets/chevron-right-B-MIBOE-.js","assets/chevron-top-DS-P3mpl.js","assets/chrome-store-6yzul1sd.js","assets/clock-Blg9LvLw.js","assets/close-CNOhuqVl.js","assets/compass-CdzIFfSq.js","assets/coinPlaceholder-Cc-Wpd-f.js","assets/copy-B58tAuG3.js","assets/cursor-C5FBgd0N.js","assets/cursor-transparent-CUGNStpa.js","assets/desktop-ClFv-grP.js","assets/disconnect-CV2n0vlb.js","assets/discord-BTLJZqLE.js","assets/etherscan-CKbiwhkv.js","assets/extension-whpYEUrY.js","assets/external-link-CTGZ3zcY.js","assets/facebook-WMewHFoi.js","assets/farcaster-CDnVwStn.js","assets/filters-DjgPcOwy.js","assets/github-kRWt7ZXQ.js","assets/google-KGkAuJKm.js","assets/help-circle-DMXMnt-i.js","assets/image-6CXcL2Hf.js","assets/id-D2BTaAo4.js","assets/info-circle-BNF7Hjmq.js","assets/lightbulb-T0U6DwmU.js","assets/mail-Fmk135S2.js","assets/mobile-BwOHYteK.js","assets/more-B_ewcGh3.js","assets/network-placeholder-CqL4PKtu.js","assets/nftPlaceholder-v-Imal9u.js","assets/off-B6574l5y.js","assets/play-store-Dnz9qxUu.js","assets/plus-BgtpMnVh.js","assets/qr-code-DsHOMdho.js","assets/recycle-horizontal-DTveoGqi.js","assets/refresh-Dryeyqf9.js","assets/search-6qCLDRM0.js","assets/send-DxxOYAop.js","assets/swapHorizontal-Du45Qbx4.js","assets/swapHorizontalMedium-upFae92O.js","assets/swapHorizontalBold-B21XfSUl.js","assets/swapHorizontalRoundedBold-DYI6LiNR.js","assets/swapVertical-Dg6YX3is.js","assets/telegram-D3Y0ND4m.js","assets/three-dots-LLwZJLQR.js","assets/twitch-Dvvc7S3F.js","assets/x-BbGl3Gfv.js","assets/twitterIcon-CQ0BaoDw.js","assets/verify-3Fsu2Vqk.js","assets/verify-filled-DYMjuDhY.js","assets/wallet-Bgd4zbs9.js","assets/walletconnect-rfZyLxrU.js","assets/wallet-placeholder-B-3IeGnA.js","assets/warning-circle-D29s2mWS.js","assets/info-YnzN3JUE.js","assets/exclamation-triangle-TvAgch8S.js","assets/reown-logo-DuUk9vLc.js"])))=>i.map(i=>d[i]);
import { oo as __vitePreload } from "./index-DlUMFm0h.js";
import { a as elementStyles, i as colorStyles, n as customElement, r as UiHelperUtil, s as resetStyles } from "./ConstantsUtil-BkAzooxe.js";
import { a as nothing, c as notEqual, i as noChange, l as css, n as _$LH, r as html, s as defaultConverter, t as LitElement } from "./lit-COTpoEUt.js";
var issueWarning$1;
globalThis.litIssuedWarnings ??= /* @__PURE__ */ new Set();
issueWarning$1 = (code, warning) => {
	warning += ` See https://lit.dev/msg/${code} for more information.`;
	if (!globalThis.litIssuedWarnings.has(warning) && !globalThis.litIssuedWarnings.has(code)) {
		console.warn(warning);
		globalThis.litIssuedWarnings.add(warning);
	}
};
var legacyProperty = (options, proto, name) => {
	const hasOwnProperty = proto.hasOwnProperty(name);
	proto.constructor.createProperty(name, options);
	return hasOwnProperty ? Object.getOwnPropertyDescriptor(proto, name) : void 0;
};
var defaultPropertyDeclaration = {
	attribute: true,
	type: String,
	converter: defaultConverter,
	reflect: false,
	hasChanged: notEqual
};
const standardProperty = (options = defaultPropertyDeclaration, target, context) => {
	const { kind, metadata } = context;
	if (metadata == null) issueWarning$1("missing-class-metadata", `The class ${target} is missing decorator metadata. This could mean that you're using a compiler that supports decorators but doesn't support decorator metadata, such as TypeScript 5.1. Please update your compiler.`);
	let properties = globalThis.litPropertyMetadata.get(metadata);
	if (properties === void 0) globalThis.litPropertyMetadata.set(metadata, properties = /* @__PURE__ */ new Map());
	if (kind === "setter") {
		options = Object.create(options);
		options.wrapped = true;
	}
	properties.set(context.name, options);
	if (kind === "accessor") {
		const { name } = context;
		return {
			set(v) {
				const oldValue = target.get.call(this);
				target.set.call(this, v);
				this.requestUpdate(name, oldValue, options);
			},
			init(v) {
				if (v !== void 0) this._$changeProperty(name, void 0, options, v);
				return v;
			}
		};
	} else if (kind === "setter") {
		const { name } = context;
		return function(value) {
			const oldValue = this[name];
			target.call(this, value);
			this.requestUpdate(name, oldValue, options);
		};
	}
	throw new Error(`Unsupported decorator location: ${kind}`);
};
function property(options) {
	return (protoOrTarget, nameOrContext) => {
		return typeof nameOrContext === "object" ? standardProperty(options, protoOrTarget, nameOrContext) : legacyProperty(options, protoOrTarget, nameOrContext);
	};
}
function state(options) {
	return property({
		...options,
		state: true,
		attribute: false
	});
}
globalThis.litIssuedWarnings ??= /* @__PURE__ */ new Set();
var styles_default$6 = css`
  :host {
    display: flex;
    width: inherit;
    height: inherit;
  }
`;
var __decorate$6 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WuiFlex = class WuiFlex$1 extends LitElement {
	render() {
		this.style.cssText = `
      flex-direction: ${this.flexDirection};
      flex-wrap: ${this.flexWrap};
      flex-basis: ${this.flexBasis};
      flex-grow: ${this.flexGrow};
      flex-shrink: ${this.flexShrink};
      align-items: ${this.alignItems};
      justify-content: ${this.justifyContent};
      column-gap: ${this.columnGap && `var(--wui-spacing-${this.columnGap})`};
      row-gap: ${this.rowGap && `var(--wui-spacing-${this.rowGap})`};
      gap: ${this.gap && `var(--wui-spacing-${this.gap})`};
      padding-top: ${this.padding && UiHelperUtil.getSpacingStyles(this.padding, 0)};
      padding-right: ${this.padding && UiHelperUtil.getSpacingStyles(this.padding, 1)};
      padding-bottom: ${this.padding && UiHelperUtil.getSpacingStyles(this.padding, 2)};
      padding-left: ${this.padding && UiHelperUtil.getSpacingStyles(this.padding, 3)};
      margin-top: ${this.margin && UiHelperUtil.getSpacingStyles(this.margin, 0)};
      margin-right: ${this.margin && UiHelperUtil.getSpacingStyles(this.margin, 1)};
      margin-bottom: ${this.margin && UiHelperUtil.getSpacingStyles(this.margin, 2)};
      margin-left: ${this.margin && UiHelperUtil.getSpacingStyles(this.margin, 3)};
    `;
		return html`<slot></slot>`;
	}
};
WuiFlex.styles = [resetStyles, styles_default$6];
__decorate$6([property()], WuiFlex.prototype, "flexDirection", void 0);
__decorate$6([property()], WuiFlex.prototype, "flexWrap", void 0);
__decorate$6([property()], WuiFlex.prototype, "flexBasis", void 0);
__decorate$6([property()], WuiFlex.prototype, "flexGrow", void 0);
__decorate$6([property()], WuiFlex.prototype, "flexShrink", void 0);
__decorate$6([property()], WuiFlex.prototype, "alignItems", void 0);
__decorate$6([property()], WuiFlex.prototype, "justifyContent", void 0);
__decorate$6([property()], WuiFlex.prototype, "columnGap", void 0);
__decorate$6([property()], WuiFlex.prototype, "rowGap", void 0);
__decorate$6([property()], WuiFlex.prototype, "gap", void 0);
__decorate$6([property()], WuiFlex.prototype, "padding", void 0);
__decorate$6([property()], WuiFlex.prototype, "margin", void 0);
WuiFlex = __decorate$6([customElement("wui-flex")], WuiFlex);
const ifDefined = (value) => value ?? nothing;
var { _ChildPart: ChildPart } = _$LH;
window.ShadyDOM?.inUse && window.ShadyDOM?.noPatch === true && window.ShadyDOM.wrap;
const isPrimitive = (value) => value === null || typeof value != "object" && typeof value != "function";
const isSingleExpression = (part) => part.strings === void 0;
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
const PartType = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
};
const directive = (c) => (...values) => ({
	["_$litDirective$"]: c,
	values
});
var Directive = class {
	constructor(_partInfo) {}
	get _$isConnected() {
		return this._$parent._$isConnected;
	}
	_$initialize(part, parent, attributeIndex) {
		this.__part = part;
		this._$parent = parent;
		this.__attributeIndex = attributeIndex;
	}
	_$resolve(part, props) {
		return this.update(part, props);
	}
	update(_part, props) {
		return this.render(...props);
	}
};
var notifyChildrenConnectedChanged = (parent, isConnected) => {
	const children = parent._$disconnectableChildren;
	if (children === void 0) return false;
	for (const obj of children) {
		obj["_$notifyDirectiveConnectionChanged"]?.(isConnected, false);
		notifyChildrenConnectedChanged(obj, isConnected);
	}
	return true;
};
var removeDisconnectableFromParent = (obj) => {
	let parent, children;
	do {
		if ((parent = obj._$parent) === void 0) break;
		children = parent._$disconnectableChildren;
		children.delete(obj);
		obj = parent;
	} while (children?.size === 0);
};
var addDisconnectableToParent = (obj) => {
	for (let parent; parent = obj._$parent; obj = parent) {
		let children = parent._$disconnectableChildren;
		if (children === void 0) parent._$disconnectableChildren = children = /* @__PURE__ */ new Set();
		else if (children.has(obj)) break;
		children.add(obj);
		installDisconnectAPI(parent);
	}
};
function reparentDisconnectables(newParent) {
	if (this._$disconnectableChildren !== void 0) {
		removeDisconnectableFromParent(this);
		this._$parent = newParent;
		addDisconnectableToParent(this);
	} else this._$parent = newParent;
}
function notifyChildPartConnectedChanged(isConnected, isClearingValue = false, fromPartIndex = 0) {
	const value = this._$committedValue;
	const children = this._$disconnectableChildren;
	if (children === void 0 || children.size === 0) return;
	if (isClearingValue) {
		if (Array.isArray(value)) for (let i = fromPartIndex; i < value.length; i++) {
			notifyChildrenConnectedChanged(value[i], false);
			removeDisconnectableFromParent(value[i]);
		}
		else if (value != null) {
			notifyChildrenConnectedChanged(value, false);
			removeDisconnectableFromParent(value);
		}
	} else notifyChildrenConnectedChanged(this, isConnected);
}
var installDisconnectAPI = (obj) => {
	if (obj.type == PartType.CHILD) {
		obj._$notifyConnectionChanged ??= notifyChildPartConnectedChanged;
		obj._$reparentDisconnectables ??= reparentDisconnectables;
	}
};
var AsyncDirective = class extends Directive {
	constructor() {
		super(...arguments);
		this._$disconnectableChildren = void 0;
	}
	_$initialize(part, parent, attributeIndex) {
		super._$initialize(part, parent, attributeIndex);
		addDisconnectableToParent(this);
		this.isConnected = part._$isConnected;
	}
	["_$notifyDirectiveConnectionChanged"](isConnected, isClearingDirective = true) {
		if (isConnected !== this.isConnected) {
			this.isConnected = isConnected;
			if (isConnected) this.reconnected?.();
			else this.disconnected?.();
		}
		if (isClearingDirective) {
			notifyChildrenConnectedChanged(this, isConnected);
			removeDisconnectableFromParent(this);
		}
	}
	setValue(value) {
		if (isSingleExpression(this.__part)) this.__part._$setValue(value, this);
		else {
			if (this.__attributeIndex === void 0) throw new Error(`Expected this.__attributeIndex to be a number`);
			const newValues = [...this.__part._$committedValue];
			newValues[this.__attributeIndex] = value;
			this.__part._$setValue(newValues, this, 0);
		}
	}
	disconnected() {}
	reconnected() {}
};
var PseudoWeakRef = class {
	constructor(ref) {
		this._ref = ref;
	}
	disconnect() {
		this._ref = void 0;
	}
	reconnect(ref) {
		this._ref = ref;
	}
	deref() {
		return this._ref;
	}
};
var Pauser = class {
	constructor() {
		this._promise = void 0;
		this._resolve = void 0;
	}
	get() {
		return this._promise;
	}
	pause() {
		this._promise ??= new Promise((resolve) => this._resolve = resolve);
	}
	resume() {
		this._resolve?.();
		this._promise = this._resolve = void 0;
	}
};
var isPromise = (x) => {
	return !isPrimitive(x) && typeof x.then === "function";
};
var _infinity = 1073741823;
var UntilDirective = class extends AsyncDirective {
	constructor() {
		super(...arguments);
		this.__lastRenderedIndex = _infinity;
		this.__values = [];
		this.__weakThis = new PseudoWeakRef(this);
		this.__pauser = new Pauser();
	}
	render(...args) {
		return args.find((x) => !isPromise(x)) ?? noChange;
	}
	update(_part, args) {
		const previousValues = this.__values;
		let previousLength = previousValues.length;
		this.__values = args;
		const weakThis = this.__weakThis;
		const pauser = this.__pauser;
		if (!this.isConnected) this.disconnected();
		for (let i = 0; i < args.length; i++) {
			if (i > this.__lastRenderedIndex) break;
			const value = args[i];
			if (!isPromise(value)) {
				this.__lastRenderedIndex = i;
				return value;
			}
			if (i < previousLength && value === previousValues[i]) continue;
			this.__lastRenderedIndex = _infinity;
			previousLength = 0;
			Promise.resolve(value).then(async (result) => {
				while (pauser.get()) await pauser.get();
				const _this = weakThis.deref();
				if (_this !== void 0) {
					const index = _this.__values.indexOf(value);
					if (index > -1 && index < _this.__lastRenderedIndex) {
						_this.__lastRenderedIndex = index;
						_this.setValue(result);
					}
				}
			});
		}
		return noChange;
	}
	disconnected() {
		this.__weakThis.disconnect();
		this.__pauser.pause();
	}
	reconnected() {
		this.__weakThis.reconnect(this);
		this.__pauser.resume();
	}
};
const until = directive(UntilDirective);
var CacheUtil = class {
	constructor() {
		this.cache = /* @__PURE__ */ new Map();
	}
	set(key, value) {
		this.cache.set(key, value);
	}
	get(key) {
		return this.cache.get(key);
	}
	has(key) {
		return this.cache.has(key);
	}
	delete(key) {
		this.cache.delete(key);
	}
	clear() {
		this.cache.clear();
	}
};
const globalSvgCache = new CacheUtil();
var styles_default$5 = css`
  :host {
    display: flex;
    aspect-ratio: var(--local-aspect-ratio);
    color: var(--local-color);
    width: var(--local-width);
  }

  svg {
    width: inherit;
    height: inherit;
    object-fit: contain;
    object-position: center;
  }

  .fallback {
    width: var(--local-width);
    height: var(--local-height);
  }
`;
var __decorate$5 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ICONS = {
	add: async () => (await __vitePreload(async () => {
		const { addSvg } = await import("./add-2PZ3Kr9N.js");
		return { addSvg };
	}, __vite__mapDeps([0,1]))).addSvg,
	allWallets: async () => (await __vitePreload(async () => {
		const { allWalletsSvg } = await import("./all-wallets-BbndLtmM.js");
		return { allWalletsSvg };
	}, __vite__mapDeps([2,1]))).allWalletsSvg,
	arrowBottomCircle: async () => (await __vitePreload(async () => {
		const { arrowBottomCircleSvg } = await import("./arrow-bottom-circle-czucrzps.js");
		return { arrowBottomCircleSvg };
	}, __vite__mapDeps([3,1]))).arrowBottomCircleSvg,
	appStore: async () => (await __vitePreload(async () => {
		const { appStoreSvg } = await import("./app-store-Bd0wNYp3.js");
		return { appStoreSvg };
	}, __vite__mapDeps([4,1]))).appStoreSvg,
	apple: async () => (await __vitePreload(async () => {
		const { appleSvg } = await import("./apple-GLk4yeZX.js");
		return { appleSvg };
	}, __vite__mapDeps([5,1]))).appleSvg,
	arrowBottom: async () => (await __vitePreload(async () => {
		const { arrowBottomSvg } = await import("./arrow-bottom-DfQv1Xt6.js");
		return { arrowBottomSvg };
	}, __vite__mapDeps([6,1]))).arrowBottomSvg,
	arrowLeft: async () => (await __vitePreload(async () => {
		const { arrowLeftSvg } = await import("./arrow-left-CCBO1FnC.js");
		return { arrowLeftSvg };
	}, __vite__mapDeps([7,1]))).arrowLeftSvg,
	arrowRight: async () => (await __vitePreload(async () => {
		const { arrowRightSvg } = await import("./arrow-right-skjycKFt.js");
		return { arrowRightSvg };
	}, __vite__mapDeps([8,1]))).arrowRightSvg,
	arrowTop: async () => (await __vitePreload(async () => {
		const { arrowTopSvg } = await import("./arrow-top-BWrCtgAI.js");
		return { arrowTopSvg };
	}, __vite__mapDeps([9,1]))).arrowTopSvg,
	bank: async () => (await __vitePreload(async () => {
		const { bankSvg } = await import("./bank-CtT5O10Q.js");
		return { bankSvg };
	}, __vite__mapDeps([10,1]))).bankSvg,
	browser: async () => (await __vitePreload(async () => {
		const { browserSvg } = await import("./browser-DwyeaVB6.js");
		return { browserSvg };
	}, __vite__mapDeps([11,1]))).browserSvg,
	card: async () => (await __vitePreload(async () => {
		const { cardSvg } = await import("./card-D5yw6jr6.js");
		return { cardSvg };
	}, __vite__mapDeps([12,1]))).cardSvg,
	checkmark: async () => (await __vitePreload(async () => {
		const { checkmarkSvg } = await import("./checkmark-YGfe1m4b.js");
		return { checkmarkSvg };
	}, __vite__mapDeps([13,1]))).checkmarkSvg,
	checkmarkBold: async () => (await __vitePreload(async () => {
		const { checkmarkBoldSvg } = await import("./checkmark-bold-Cv_cSVBi.js");
		return { checkmarkBoldSvg };
	}, __vite__mapDeps([14,1]))).checkmarkBoldSvg,
	chevronBottom: async () => (await __vitePreload(async () => {
		const { chevronBottomSvg } = await import("./chevron-bottom-DaCRl5iA.js");
		return { chevronBottomSvg };
	}, __vite__mapDeps([15,1]))).chevronBottomSvg,
	chevronLeft: async () => (await __vitePreload(async () => {
		const { chevronLeftSvg } = await import("./chevron-left-DxncEX3j.js");
		return { chevronLeftSvg };
	}, __vite__mapDeps([16,1]))).chevronLeftSvg,
	chevronRight: async () => (await __vitePreload(async () => {
		const { chevronRightSvg } = await import("./chevron-right-B-MIBOE-.js");
		return { chevronRightSvg };
	}, __vite__mapDeps([17,1]))).chevronRightSvg,
	chevronTop: async () => (await __vitePreload(async () => {
		const { chevronTopSvg } = await import("./chevron-top-DS-P3mpl.js");
		return { chevronTopSvg };
	}, __vite__mapDeps([18,1]))).chevronTopSvg,
	chromeStore: async () => (await __vitePreload(async () => {
		const { chromeStoreSvg } = await import("./chrome-store-6yzul1sd.js");
		return { chromeStoreSvg };
	}, __vite__mapDeps([19,1]))).chromeStoreSvg,
	clock: async () => (await __vitePreload(async () => {
		const { clockSvg } = await import("./clock-Blg9LvLw.js");
		return { clockSvg };
	}, __vite__mapDeps([20,1]))).clockSvg,
	close: async () => (await __vitePreload(async () => {
		const { closeSvg } = await import("./close-CNOhuqVl.js");
		return { closeSvg };
	}, __vite__mapDeps([21,1]))).closeSvg,
	compass: async () => (await __vitePreload(async () => {
		const { compassSvg } = await import("./compass-CdzIFfSq.js");
		return { compassSvg };
	}, __vite__mapDeps([22,1]))).compassSvg,
	coinPlaceholder: async () => (await __vitePreload(async () => {
		const { coinPlaceholderSvg } = await import("./coinPlaceholder-Cc-Wpd-f.js");
		return { coinPlaceholderSvg };
	}, __vite__mapDeps([23,1]))).coinPlaceholderSvg,
	copy: async () => (await __vitePreload(async () => {
		const { copySvg } = await import("./copy-B58tAuG3.js");
		return { copySvg };
	}, __vite__mapDeps([24,1]))).copySvg,
	cursor: async () => (await __vitePreload(async () => {
		const { cursorSvg } = await import("./cursor-C5FBgd0N.js");
		return { cursorSvg };
	}, __vite__mapDeps([25,1]))).cursorSvg,
	cursorTransparent: async () => (await __vitePreload(async () => {
		const { cursorTransparentSvg } = await import("./cursor-transparent-CUGNStpa.js");
		return { cursorTransparentSvg };
	}, __vite__mapDeps([26,1]))).cursorTransparentSvg,
	desktop: async () => (await __vitePreload(async () => {
		const { desktopSvg } = await import("./desktop-ClFv-grP.js");
		return { desktopSvg };
	}, __vite__mapDeps([27,1]))).desktopSvg,
	disconnect: async () => (await __vitePreload(async () => {
		const { disconnectSvg } = await import("./disconnect-CV2n0vlb.js");
		return { disconnectSvg };
	}, __vite__mapDeps([28,1]))).disconnectSvg,
	discord: async () => (await __vitePreload(async () => {
		const { discordSvg } = await import("./discord-BTLJZqLE.js");
		return { discordSvg };
	}, __vite__mapDeps([29,1]))).discordSvg,
	etherscan: async () => (await __vitePreload(async () => {
		const { etherscanSvg } = await import("./etherscan-CKbiwhkv.js");
		return { etherscanSvg };
	}, __vite__mapDeps([30,1]))).etherscanSvg,
	extension: async () => (await __vitePreload(async () => {
		const { extensionSvg } = await import("./extension-whpYEUrY.js");
		return { extensionSvg };
	}, __vite__mapDeps([31,1]))).extensionSvg,
	externalLink: async () => (await __vitePreload(async () => {
		const { externalLinkSvg } = await import("./external-link-CTGZ3zcY.js");
		return { externalLinkSvg };
	}, __vite__mapDeps([32,1]))).externalLinkSvg,
	facebook: async () => (await __vitePreload(async () => {
		const { facebookSvg } = await import("./facebook-WMewHFoi.js");
		return { facebookSvg };
	}, __vite__mapDeps([33,1]))).facebookSvg,
	farcaster: async () => (await __vitePreload(async () => {
		const { farcasterSvg } = await import("./farcaster-CDnVwStn.js");
		return { farcasterSvg };
	}, __vite__mapDeps([34,1]))).farcasterSvg,
	filters: async () => (await __vitePreload(async () => {
		const { filtersSvg } = await import("./filters-DjgPcOwy.js");
		return { filtersSvg };
	}, __vite__mapDeps([35,1]))).filtersSvg,
	github: async () => (await __vitePreload(async () => {
		const { githubSvg } = await import("./github-kRWt7ZXQ.js");
		return { githubSvg };
	}, __vite__mapDeps([36,1]))).githubSvg,
	google: async () => (await __vitePreload(async () => {
		const { googleSvg } = await import("./google-KGkAuJKm.js");
		return { googleSvg };
	}, __vite__mapDeps([37,1]))).googleSvg,
	helpCircle: async () => (await __vitePreload(async () => {
		const { helpCircleSvg } = await import("./help-circle-DMXMnt-i.js");
		return { helpCircleSvg };
	}, __vite__mapDeps([38,1]))).helpCircleSvg,
	image: async () => (await __vitePreload(async () => {
		const { imageSvg } = await import("./image-6CXcL2Hf.js");
		return { imageSvg };
	}, __vite__mapDeps([39,1]))).imageSvg,
	id: async () => (await __vitePreload(async () => {
		const { idSvg } = await import("./id-D2BTaAo4.js");
		return { idSvg };
	}, __vite__mapDeps([40,1]))).idSvg,
	infoCircle: async () => (await __vitePreload(async () => {
		const { infoCircleSvg } = await import("./info-circle-BNF7Hjmq.js");
		return { infoCircleSvg };
	}, __vite__mapDeps([41,1]))).infoCircleSvg,
	lightbulb: async () => (await __vitePreload(async () => {
		const { lightbulbSvg } = await import("./lightbulb-T0U6DwmU.js");
		return { lightbulbSvg };
	}, __vite__mapDeps([42,1]))).lightbulbSvg,
	mail: async () => (await __vitePreload(async () => {
		const { mailSvg } = await import("./mail-Fmk135S2.js");
		return { mailSvg };
	}, __vite__mapDeps([43,1]))).mailSvg,
	mobile: async () => (await __vitePreload(async () => {
		const { mobileSvg } = await import("./mobile-BwOHYteK.js");
		return { mobileSvg };
	}, __vite__mapDeps([44,1]))).mobileSvg,
	more: async () => (await __vitePreload(async () => {
		const { moreSvg } = await import("./more-B_ewcGh3.js");
		return { moreSvg };
	}, __vite__mapDeps([45,1]))).moreSvg,
	networkPlaceholder: async () => (await __vitePreload(async () => {
		const { networkPlaceholderSvg } = await import("./network-placeholder-CqL4PKtu.js");
		return { networkPlaceholderSvg };
	}, __vite__mapDeps([46,1]))).networkPlaceholderSvg,
	nftPlaceholder: async () => (await __vitePreload(async () => {
		const { nftPlaceholderSvg } = await import("./nftPlaceholder-v-Imal9u.js");
		return { nftPlaceholderSvg };
	}, __vite__mapDeps([47,1]))).nftPlaceholderSvg,
	off: async () => (await __vitePreload(async () => {
		const { offSvg } = await import("./off-B6574l5y.js");
		return { offSvg };
	}, __vite__mapDeps([48,1]))).offSvg,
	playStore: async () => (await __vitePreload(async () => {
		const { playStoreSvg } = await import("./play-store-Dnz9qxUu.js");
		return { playStoreSvg };
	}, __vite__mapDeps([49,1]))).playStoreSvg,
	plus: async () => (await __vitePreload(async () => {
		const { plusSvg } = await import("./plus-BgtpMnVh.js");
		return { plusSvg };
	}, __vite__mapDeps([50,1]))).plusSvg,
	qrCode: async () => (await __vitePreload(async () => {
		const { qrCodeIcon } = await import("./qr-code-DsHOMdho.js");
		return { qrCodeIcon };
	}, __vite__mapDeps([51,1]))).qrCodeIcon,
	recycleHorizontal: async () => (await __vitePreload(async () => {
		const { recycleHorizontalSvg } = await import("./recycle-horizontal-DTveoGqi.js");
		return { recycleHorizontalSvg };
	}, __vite__mapDeps([52,1]))).recycleHorizontalSvg,
	refresh: async () => (await __vitePreload(async () => {
		const { refreshSvg } = await import("./refresh-Dryeyqf9.js");
		return { refreshSvg };
	}, __vite__mapDeps([53,1]))).refreshSvg,
	search: async () => (await __vitePreload(async () => {
		const { searchSvg } = await import("./search-6qCLDRM0.js");
		return { searchSvg };
	}, __vite__mapDeps([54,1]))).searchSvg,
	send: async () => (await __vitePreload(async () => {
		const { sendSvg } = await import("./send-DxxOYAop.js");
		return { sendSvg };
	}, __vite__mapDeps([55,1]))).sendSvg,
	swapHorizontal: async () => (await __vitePreload(async () => {
		const { swapHorizontalSvg } = await import("./swapHorizontal-Du45Qbx4.js");
		return { swapHorizontalSvg };
	}, __vite__mapDeps([56,1]))).swapHorizontalSvg,
	swapHorizontalMedium: async () => (await __vitePreload(async () => {
		const { swapHorizontalMediumSvg } = await import("./swapHorizontalMedium-upFae92O.js");
		return { swapHorizontalMediumSvg };
	}, __vite__mapDeps([57,1]))).swapHorizontalMediumSvg,
	swapHorizontalBold: async () => (await __vitePreload(async () => {
		const { swapHorizontalBoldSvg } = await import("./swapHorizontalBold-B21XfSUl.js");
		return { swapHorizontalBoldSvg };
	}, __vite__mapDeps([58,1]))).swapHorizontalBoldSvg,
	swapHorizontalRoundedBold: async () => (await __vitePreload(async () => {
		const { swapHorizontalRoundedBoldSvg } = await import("./swapHorizontalRoundedBold-DYI6LiNR.js");
		return { swapHorizontalRoundedBoldSvg };
	}, __vite__mapDeps([59,1]))).swapHorizontalRoundedBoldSvg,
	swapVertical: async () => (await __vitePreload(async () => {
		const { swapVerticalSvg } = await import("./swapVertical-Dg6YX3is.js");
		return { swapVerticalSvg };
	}, __vite__mapDeps([60,1]))).swapVerticalSvg,
	telegram: async () => (await __vitePreload(async () => {
		const { telegramSvg } = await import("./telegram-D3Y0ND4m.js");
		return { telegramSvg };
	}, __vite__mapDeps([61,1]))).telegramSvg,
	threeDots: async () => (await __vitePreload(async () => {
		const { threeDotsSvg } = await import("./three-dots-LLwZJLQR.js");
		return { threeDotsSvg };
	}, __vite__mapDeps([62,1]))).threeDotsSvg,
	twitch: async () => (await __vitePreload(async () => {
		const { twitchSvg } = await import("./twitch-Dvvc7S3F.js");
		return { twitchSvg };
	}, __vite__mapDeps([63,1]))).twitchSvg,
	twitter: async () => (await __vitePreload(async () => {
		const { xSvg } = await import("./x-BbGl3Gfv.js");
		return { xSvg };
	}, __vite__mapDeps([64,1]))).xSvg,
	twitterIcon: async () => (await __vitePreload(async () => {
		const { twitterIconSvg } = await import("./twitterIcon-CQ0BaoDw.js");
		return { twitterIconSvg };
	}, __vite__mapDeps([65,1]))).twitterIconSvg,
	verify: async () => (await __vitePreload(async () => {
		const { verifySvg } = await import("./verify-3Fsu2Vqk.js");
		return { verifySvg };
	}, __vite__mapDeps([66,1]))).verifySvg,
	verifyFilled: async () => (await __vitePreload(async () => {
		const { verifyFilledSvg } = await import("./verify-filled-DYMjuDhY.js");
		return { verifyFilledSvg };
	}, __vite__mapDeps([67,1]))).verifyFilledSvg,
	wallet: async () => (await __vitePreload(async () => {
		const { walletSvg } = await import("./wallet-Bgd4zbs9.js");
		return { walletSvg };
	}, __vite__mapDeps([68,1]))).walletSvg,
	walletConnect: async () => (await __vitePreload(async () => {
		const { walletConnectSvg } = await import("./walletconnect-rfZyLxrU.js");
		return { walletConnectSvg };
	}, __vite__mapDeps([69,1]))).walletConnectSvg,
	walletConnectLightBrown: async () => (await __vitePreload(async () => {
		const { walletConnectLightBrownSvg } = await import("./walletconnect-rfZyLxrU.js");
		return { walletConnectLightBrownSvg };
	}, __vite__mapDeps([69,1]))).walletConnectLightBrownSvg,
	walletConnectBrown: async () => (await __vitePreload(async () => {
		const { walletConnectBrownSvg } = await import("./walletconnect-rfZyLxrU.js");
		return { walletConnectBrownSvg };
	}, __vite__mapDeps([69,1]))).walletConnectBrownSvg,
	walletPlaceholder: async () => (await __vitePreload(async () => {
		const { walletPlaceholderSvg } = await import("./wallet-placeholder-B-3IeGnA.js");
		return { walletPlaceholderSvg };
	}, __vite__mapDeps([70,1]))).walletPlaceholderSvg,
	warningCircle: async () => (await __vitePreload(async () => {
		const { warningCircleSvg } = await import("./warning-circle-D29s2mWS.js");
		return { warningCircleSvg };
	}, __vite__mapDeps([71,1]))).warningCircleSvg,
	x: async () => (await __vitePreload(async () => {
		const { xSvg } = await import("./x-BbGl3Gfv.js");
		return { xSvg };
	}, __vite__mapDeps([64,1]))).xSvg,
	info: async () => (await __vitePreload(async () => {
		const { infoSvg } = await import("./info-YnzN3JUE.js");
		return { infoSvg };
	}, __vite__mapDeps([72,1]))).infoSvg,
	exclamationTriangle: async () => (await __vitePreload(async () => {
		const { exclamationTriangleSvg } = await import("./exclamation-triangle-TvAgch8S.js");
		return { exclamationTriangleSvg };
	}, __vite__mapDeps([73,1]))).exclamationTriangleSvg,
	reown: async () => (await __vitePreload(async () => {
		const { reownSvg } = await import("./reown-logo-DuUk9vLc.js");
		return { reownSvg };
	}, __vite__mapDeps([74,1]))).reownSvg
};
async function getSvg(name) {
	if (globalSvgCache.has(name)) return globalSvgCache.get(name);
	const svgPromise = (ICONS[name] ?? ICONS.copy)();
	globalSvgCache.set(name, svgPromise);
	return svgPromise;
}
var WuiIcon = class WuiIcon$1 extends LitElement {
	constructor() {
		super(...arguments);
		this.size = "md";
		this.name = "copy";
		this.color = "fg-300";
		this.aspectRatio = "1 / 1";
	}
	render() {
		this.style.cssText = `
      --local-color: ${`var(--wui-color-${this.color});`}
      --local-width: ${`var(--wui-icon-size-${this.size});`}
      --local-aspect-ratio: ${this.aspectRatio}
    `;
		return html`${until(getSvg(this.name), html`<div class="fallback"></div>`)}`;
	}
};
WuiIcon.styles = [
	resetStyles,
	colorStyles,
	styles_default$5
];
__decorate$5([property()], WuiIcon.prototype, "size", void 0);
__decorate$5([property()], WuiIcon.prototype, "name", void 0);
__decorate$5([property()], WuiIcon.prototype, "color", void 0);
__decorate$5([property()], WuiIcon.prototype, "aspectRatio", void 0);
WuiIcon = __decorate$5([customElement("wui-icon")], WuiIcon);
var ClassMapDirective = class extends Directive {
	constructor(partInfo) {
		super(partInfo);
		if (partInfo.type !== PartType.ATTRIBUTE || partInfo.name !== "class" || partInfo.strings?.length > 2) throw new Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
	}
	render(classInfo) {
		return " " + Object.keys(classInfo).filter((key) => classInfo[key]).join(" ") + " ";
	}
	update(part, [classInfo]) {
		if (this._previousClasses === void 0) {
			this._previousClasses = /* @__PURE__ */ new Set();
			if (part.strings !== void 0) this._staticClasses = new Set(part.strings.join(" ").split(/\s/).filter((s) => s !== ""));
			for (const name in classInfo) if (classInfo[name] && !this._staticClasses?.has(name)) this._previousClasses.add(name);
			return this.render(classInfo);
		}
		const classList = part.element.classList;
		for (const name of this._previousClasses) if (!(name in classInfo)) {
			classList.remove(name);
			this._previousClasses.delete(name);
		}
		for (const name in classInfo) {
			const value = !!classInfo[name];
			if (value !== this._previousClasses.has(name) && !this._staticClasses?.has(name)) if (value) {
				classList.add(name);
				this._previousClasses.add(name);
			} else {
				classList.remove(name);
				this._previousClasses.delete(name);
			}
		}
		return noChange;
	}
};
const classMap = directive(ClassMapDirective);
var styles_default$4 = css`
  :host {
    display: inline-flex !important;
  }

  slot {
    width: 100%;
    display: inline-block;
    font-style: normal;
    font-family: var(--wui-font-family);
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'case' on;
    line-height: 130%;
    font-weight: var(--wui-font-weight-regular);
    overflow: inherit;
    text-overflow: inherit;
    text-align: var(--local-align);
    color: var(--local-color);
  }

  .wui-line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .wui-line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .wui-font-medium-400 {
    font-size: var(--wui-font-size-medium);
    font-weight: var(--wui-font-weight-light);
    letter-spacing: var(--wui-letter-spacing-medium);
  }

  .wui-font-medium-600 {
    font-size: var(--wui-font-size-medium);
    letter-spacing: var(--wui-letter-spacing-medium);
  }

  .wui-font-title-600 {
    font-size: var(--wui-font-size-title);
    letter-spacing: var(--wui-letter-spacing-title);
  }

  .wui-font-title-6-600 {
    font-size: var(--wui-font-size-title-6);
    letter-spacing: var(--wui-letter-spacing-title-6);
  }

  .wui-font-mini-700 {
    font-size: var(--wui-font-size-mini);
    letter-spacing: var(--wui-letter-spacing-mini);
    text-transform: uppercase;
  }

  .wui-font-large-500,
  .wui-font-large-600,
  .wui-font-large-700 {
    font-size: var(--wui-font-size-large);
    letter-spacing: var(--wui-letter-spacing-large);
  }

  .wui-font-2xl-500,
  .wui-font-2xl-600,
  .wui-font-2xl-700 {
    font-size: var(--wui-font-size-2xl);
    letter-spacing: var(--wui-letter-spacing-2xl);
  }

  .wui-font-paragraph-400,
  .wui-font-paragraph-500,
  .wui-font-paragraph-600,
  .wui-font-paragraph-700 {
    font-size: var(--wui-font-size-paragraph);
    letter-spacing: var(--wui-letter-spacing-paragraph);
  }

  .wui-font-small-400,
  .wui-font-small-500,
  .wui-font-small-600 {
    font-size: var(--wui-font-size-small);
    letter-spacing: var(--wui-letter-spacing-small);
  }

  .wui-font-tiny-400,
  .wui-font-tiny-500,
  .wui-font-tiny-600 {
    font-size: var(--wui-font-size-tiny);
    letter-spacing: var(--wui-letter-spacing-tiny);
  }

  .wui-font-micro-700,
  .wui-font-micro-600 {
    font-size: var(--wui-font-size-micro);
    letter-spacing: var(--wui-letter-spacing-micro);
    text-transform: uppercase;
  }

  .wui-font-tiny-400,
  .wui-font-small-400,
  .wui-font-medium-400,
  .wui-font-paragraph-400 {
    font-weight: var(--wui-font-weight-light);
  }

  .wui-font-large-700,
  .wui-font-paragraph-700,
  .wui-font-micro-700,
  .wui-font-mini-700 {
    font-weight: var(--wui-font-weight-bold);
  }

  .wui-font-medium-600,
  .wui-font-medium-title-600,
  .wui-font-title-6-600,
  .wui-font-large-600,
  .wui-font-paragraph-600,
  .wui-font-small-600,
  .wui-font-tiny-600,
  .wui-font-micro-600 {
    font-weight: var(--wui-font-weight-medium);
  }

  :host([disabled]) {
    opacity: 0.4;
  }
`;
var __decorate$4 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WuiText = class WuiText$1 extends LitElement {
	constructor() {
		super(...arguments);
		this.variant = "paragraph-500";
		this.color = "fg-300";
		this.align = "left";
		this.lineClamp = void 0;
	}
	render() {
		const classes = {
			[`wui-font-${this.variant}`]: true,
			[`wui-color-${this.color}`]: true,
			[`wui-line-clamp-${this.lineClamp}`]: this.lineClamp ? true : false
		};
		this.style.cssText = `
      --local-align: ${this.align};
      --local-color: var(--wui-color-${this.color});
    `;
		return html`<slot class=${classMap(classes)}></slot>`;
	}
};
WuiText.styles = [resetStyles, styles_default$4];
__decorate$4([property()], WuiText.prototype, "variant", void 0);
__decorate$4([property()], WuiText.prototype, "color", void 0);
__decorate$4([property()], WuiText.prototype, "align", void 0);
__decorate$4([property()], WuiText.prototype, "lineClamp", void 0);
WuiText = __decorate$4([customElement("wui-text")], WuiText);
var styles_default$3 = css`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    background-color: var(--wui-color-gray-glass-020);
    border-radius: var(--local-border-radius);
    border: var(--local-border);
    box-sizing: content-box;
    width: var(--local-size);
    height: var(--local-size);
    min-height: var(--local-size);
    min-width: var(--local-size);
  }

  @supports (background: color-mix(in srgb, white 50%, black)) {
    :host {
      background-color: color-mix(in srgb, var(--local-bg-value) var(--local-bg-mix), transparent);
    }
  }
`;
var __decorate$3 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WuiIconBox = class WuiIconBox$1 extends LitElement {
	constructor() {
		super(...arguments);
		this.size = "md";
		this.backgroundColor = "accent-100";
		this.iconColor = "accent-100";
		this.background = "transparent";
		this.border = false;
		this.borderColor = "wui-color-bg-125";
		this.icon = "copy";
	}
	render() {
		const iconSize = this.iconSize || this.size;
		const isLg = this.size === "lg";
		const isXl = this.size === "xl";
		const bgMix = isLg ? "12%" : "16%";
		const borderRadius = isLg ? "xxs" : isXl ? "s" : "3xl";
		const isGray = this.background === "gray";
		const isOpaque = this.background === "opaque";
		const isColorChange = this.backgroundColor === "accent-100" && isOpaque || this.backgroundColor === "success-100" && isOpaque || this.backgroundColor === "error-100" && isOpaque || this.backgroundColor === "inverse-100" && isOpaque;
		let bgValueVariable = `var(--wui-color-${this.backgroundColor})`;
		if (isColorChange) bgValueVariable = `var(--wui-icon-box-bg-${this.backgroundColor})`;
		else if (isGray) bgValueVariable = `var(--wui-color-gray-${this.backgroundColor})`;
		this.style.cssText = `
       --local-bg-value: ${bgValueVariable};
       --local-bg-mix: ${isColorChange || isGray ? `100%` : bgMix};
       --local-border-radius: var(--wui-border-radius-${borderRadius});
       --local-size: var(--wui-icon-box-size-${this.size});
       --local-border: ${this.borderColor === "wui-color-bg-125" ? `2px` : `1px`} solid ${this.border ? `var(--${this.borderColor})` : `transparent`}
   `;
		return html` <wui-icon color=${this.iconColor} size=${iconSize} name=${this.icon}></wui-icon> `;
	}
};
WuiIconBox.styles = [
	resetStyles,
	elementStyles,
	styles_default$3
];
__decorate$3([property()], WuiIconBox.prototype, "size", void 0);
__decorate$3([property()], WuiIconBox.prototype, "backgroundColor", void 0);
__decorate$3([property()], WuiIconBox.prototype, "iconColor", void 0);
__decorate$3([property()], WuiIconBox.prototype, "iconSize", void 0);
__decorate$3([property()], WuiIconBox.prototype, "background", void 0);
__decorate$3([property({ type: Boolean })], WuiIconBox.prototype, "border", void 0);
__decorate$3([property()], WuiIconBox.prototype, "borderColor", void 0);
__decorate$3([property()], WuiIconBox.prototype, "icon", void 0);
WuiIconBox = __decorate$3([customElement("wui-icon-box")], WuiIconBox);
var styles_default$2 = css`
  :host {
    display: block;
    width: var(--local-width);
    height: var(--local-height);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: inherit;
  }
`;
var __decorate$2 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WuiImage = class WuiImage$1 extends LitElement {
	constructor() {
		super(...arguments);
		this.src = "./path/to/image.jpg";
		this.alt = "Image";
		this.size = void 0;
	}
	render() {
		this.style.cssText = `
      --local-width: ${this.size ? `var(--wui-icon-size-${this.size});` : "100%"};
      --local-height: ${this.size ? `var(--wui-icon-size-${this.size});` : "100%"};
      `;
		return html`<img src=${this.src} alt=${this.alt} @error=${this.handleImageError} />`;
	}
	handleImageError() {
		this.dispatchEvent(new CustomEvent("onLoadError", {
			bubbles: true,
			composed: true
		}));
	}
};
WuiImage.styles = [
	resetStyles,
	colorStyles,
	styles_default$2
];
__decorate$2([property()], WuiImage.prototype, "src", void 0);
__decorate$2([property()], WuiImage.prototype, "alt", void 0);
__decorate$2([property()], WuiImage.prototype, "size", void 0);
WuiImage = __decorate$2([customElement("wui-image")], WuiImage);
var styles_default$1 = css`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--wui-spacing-m);
    padding: 0 var(--wui-spacing-3xs) !important;
    border-radius: var(--wui-border-radius-5xs);
    transition:
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: border-radius, background-color;
  }

  :host > wui-text {
    transform: translateY(5%);
  }

  :host([data-variant='main']) {
    background-color: var(--wui-color-accent-glass-015);
    color: var(--wui-color-accent-100);
  }

  :host([data-variant='shade']) {
    background-color: var(--wui-color-gray-glass-010);
    color: var(--wui-color-fg-200);
  }

  :host([data-variant='success']) {
    background-color: var(--wui-icon-box-bg-success-100);
    color: var(--wui-color-success-100);
  }

  :host([data-variant='error']) {
    background-color: var(--wui-icon-box-bg-error-100);
    color: var(--wui-color-error-100);
  }

  :host([data-size='lg']) {
    padding: 11px 5px !important;
  }

  :host([data-size='lg']) > wui-text {
    transform: translateY(2%);
  }
`;
var __decorate$1 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WuiTag = class WuiTag$1 extends LitElement {
	constructor() {
		super(...arguments);
		this.variant = "main";
		this.size = "lg";
	}
	render() {
		this.dataset["variant"] = this.variant;
		this.dataset["size"] = this.size;
		const textVariant = this.size === "md" ? "mini-700" : "micro-700";
		return html`
      <wui-text data-variant=${this.variant} variant=${textVariant} color="inherit">
        <slot></slot>
      </wui-text>
    `;
	}
};
WuiTag.styles = [resetStyles, styles_default$1];
__decorate$1([property()], WuiTag.prototype, "variant", void 0);
__decorate$1([property()], WuiTag.prototype, "size", void 0);
WuiTag = __decorate$1([customElement("wui-tag")], WuiTag);
var styles_default = css`
  :host {
    display: flex;
  }

  :host([data-size='sm']) > svg {
    width: 12px;
    height: 12px;
  }

  :host([data-size='md']) > svg {
    width: 16px;
    height: 16px;
  }

  :host([data-size='lg']) > svg {
    width: 24px;
    height: 24px;
  }

  :host([data-size='xl']) > svg {
    width: 32px;
    height: 32px;
  }

  svg {
    animation: rotate 2s linear infinite;
  }

  circle {
    fill: none;
    stroke: var(--local-color);
    stroke-width: 4px;
    stroke-dasharray: 1, 124;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  :host([data-size='md']) > svg > circle {
    stroke-width: 6px;
  }

  :host([data-size='sm']) > svg > circle {
    stroke-width: 8px;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 124;
      stroke-dashoffset: 0;
    }

    50% {
      stroke-dasharray: 90, 124;
      stroke-dashoffset: -35;
    }

    100% {
      stroke-dashoffset: -125;
    }
  }
`;
var __decorate = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WuiLoadingSpinner = class WuiLoadingSpinner$1 extends LitElement {
	constructor() {
		super(...arguments);
		this.color = "accent-100";
		this.size = "lg";
	}
	render() {
		this.style.cssText = `--local-color: ${this.color === "inherit" ? "inherit" : `var(--wui-color-${this.color})`}`;
		this.dataset["size"] = this.size;
		return html`<svg viewBox="25 25 50 50">
      <circle r="20" cy="50" cx="50"></circle>
    </svg>`;
	}
};
WuiLoadingSpinner.styles = [resetStyles, styles_default];
__decorate([property()], WuiLoadingSpinner.prototype, "color", void 0);
__decorate([property()], WuiLoadingSpinner.prototype, "size", void 0);
WuiLoadingSpinner = __decorate([customElement("wui-loading-spinner")], WuiLoadingSpinner);
export { state as a, ifDefined as i, AsyncDirective as n, property as o, directive as r, classMap as t };
