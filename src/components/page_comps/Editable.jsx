import { useState, useEffect, useRef } from "react";

import {
	InputGroup,
	Input,
	InputRightElement,
	FormLabel,
	FormControl,
	Icon,
	Select,
	Modal,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	Skeleton,
} from "@chakra-ui/react";

import { Editor } from "@tinymce/tinymce-react";

import { FaPen } from "react-icons/fa";

const Editable = ({ name, value, onChange, label, type = "text" }) => {
	const ref = useRef(null);
	const [isEditable, setEditable] = useState(true);

	useEffect(() => {
		isEditable && ref.current && ref.current.blur();

		ref.current && ref.current.focus();
	}, [isEditable]);

	return (
		<FormControl w={{ base: "100%", md: "45%", lg: "64" }}>
			<FormLabel
				fontSize={{ base: "sm", md: "md" }}
				color="gray.500"
				htmlFor={name}
				fontWeight="semibold"
			>
				{label}
			</FormLabel>
			<InputGroup cursor="pointer">
				<Input
					id={name}
					name={name}
					ref={ref}
					onKeyDown={({ key }) => key === "Escape" && setEditable(true)}
					value={value}
					onChange={onChange}
					onBlur={() => setEditable(true)}
					isDisabled={isEditable}
					type={type}
					fontWeight="medium"
					_placeholder={{ color: "gray.500" }}
					_disabled={{ color: "gray.500" }}
					focusBorderColor="custom.primary"
				/>
				<InputRightElement
					onClick={() => setEditable((prevState) => !prevState)}
					children={<Icon color="gray.500" as={FaPen} />}
				/>
			</InputGroup>
		</FormControl>
	);
};

const EditableSelect = ({ name, label, options, value, onChange }) => {
	return (
		<FormControl w={{ base: "100%", md: "45%", lg: "64" }}>
			<FormLabel
				fontSize={{ base: "sm", md: "md" }}
				color="gray.500"
				htmlFor={name}
				fontWeight="semibold"
			>
				{label}
			</FormLabel>
			<Select
				cursor="pointer"
				id={name}
				name={name}
				value={value}
				onChange={onChange}
				fontWeight="medium"
				color="gray.500"
				focusBorderColor="custom.primary"
				iconSize="md"
				iconColor="gray.500"
				icon={<Icon as={FaPen} />}
				autoComplete="off"
			>
				<option disabled value="">
					Select
				</option>
				{options &&
					options.map(({ value, text }) => (
						<option key={value} value={value}>
							{text}
						</option>
					))}
			</Select>
		</FormControl>
	);
};

const EditableEditor = ({ name, label, initialText, getTextOnClose }) => {
	const [isModalOpen, setModal] = useState(false);
	const [isEditorLoading, setEditorLoading] = useState(true);
	const ref = useRef(null);
	const editorRef = useRef(null);

	useEffect(() => {
		const handler = (e) => {
			if (
				e.target.closest(
					".tox-tinymce, .tox-tinymce-aux, .moxman-window, .tam-assetmanager-root"
				) !== null
			) {
				e.stopImmediatePropagation();
			}
		};
		document.addEventListener("focusin", handler);
		return () => document.removeEventListener("focusin", handler);
	}, []);

	return (
		<>
			<FormControl w={{ base: "100%", md: "45%", lg: "64" }}>
				<FormLabel
					fontSize={{ base: "sm", md: "md" }}
					color="gray.500"
					htmlFor={name}
					fontWeight="semibold"
				>
					{label}
				</FormLabel>
				<InputGroup cursor="pointer">
					<Input
						defaultValue="Edit"
						id={name}
						type="text"
						isDisabled
						fontWeight="medium"
						_disabled={{ color: "gray.500" }}
					/>
					<InputRightElement
						children={<Icon color="gray.500" as={FaPen} />}
						onClick={() => setModal(true)}
						ref={ref}
					/>
				</InputGroup>
			</FormControl>
			<Modal
				isOpen={isModalOpen}
				onClose={() => setModal(false)}
				size="full"
				finalFocusRef={ref}
				trapFocus={false}
			>
				<ModalContent>
					<ModalHeader>{label}</ModalHeader>
					<ModalCloseButton />
					<ModalBody display="flex" flexDirection="column">
						<Skeleton
							flexGrow="1"
							display="flex"
							flexDirection="column"
							isLoaded={!isEditorLoading}
							fadeDuration={1}
						>
							<Editor
								initialValue={initialText}
								onInit={(evt, editor) => {
									setEditorLoading(false);
									editorRef.current = editor;
									editor.on("Remove", () => getTextOnClose({ target: { name, value: editor.getContent() } }));
								}}
								init={{
									height: "100%",
									menu: {
										favs: {
											title: "My Favorites",
											items: "code visualaid | searchreplace | emoticons",
										},
									},
									menubar: "file edit view insert format tools table help",
									toolbar:
										"undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | " +
										"bullist numlist outdent indent | link image | print preview media fullscreen | " +
										"forecolor backcolor emoticons | help",
									plugins: [
										"advlist",
										"autolink",
										"link",
										"image",
										"lists",
										"charmap",
										"preview",
										"anchor",
										"pagebreak",
										"searchreplace",
										"wordcount",
										"visualblocks",
										"visualchars",
										"code",
										"fullscreen",
										"insertdatetime",
										"media",
										"table",
										"emoticons",
										"template",
										"help",
									],
								}}
								apiKey={`${import.meta.env.VITE_APP_TINYMCE_API_KEY}`}
								scriptLoading={{ defer: true }}
							/>
						</Skeleton>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export { Editable, EditableSelect, EditableEditor };
