import { Dialog as DialogPrimitive } from "bits-ui";

import Title from "./dialog-title.svelte?inline";
import Portal from "./dialog-portal.svelte?inline";
import Footer from "./dialog-footer.svelte?inline";
import Header from "./dialog-header.svelte?inline";
import Overlay from "./dialog-overlay.svelte?inline";
import Content from "./dialog-content.svelte?inline";
import Description from "./dialog-description.svelte?inline";

const Root = DialogPrimitive.Root;
const Trigger = DialogPrimitive.Trigger;
const Close = DialogPrimitive.Close;

export {
	Root,
	Title,
	Portal,
	Footer,
	Header,
	Trigger,
	Overlay,
	Content,
	Description,
	Close,
	//
	Root as Dialog,
	Title as DialogTitle,
	Portal as DialogPortal,
	Footer as DialogFooter,
	Header as DialogHeader,
	Trigger as DialogTrigger,
	Overlay as DialogOverlay,
	Content as DialogContent,
	Description as DialogDescription,
	Close as DialogClose,
};
