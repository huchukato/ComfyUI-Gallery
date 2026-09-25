import Modal from 'antd/es/modal/Modal';
import { Button, Flex, Input, Select, Switch, Typography } from 'antd';
import { useGalleryContext, type SettingsState } from './GalleryContext';
import { useSetState } from 'ahooks';
import { useEffect, useState } from 'react';
import { BASE_Z_INDEX } from './ComfyAppApi';
import { GithubOutlined } from '@ant-design/icons';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ borderTop: '1px solid rgba(128,128,128,0.25)', paddingTop: 12 }}>
        <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 8 }}>{title}</Typography.Title>
        <Flex vertical gap={12}>{children}</Flex>
    </div>
);

const Row = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ flex: 1 }}>
            <Typography.Text strong>{label}</Typography.Text>
            {hint && <div><Typography.Text type="secondary" style={{ fontSize: 12 }}>{hint}</Typography.Text></div>}
        </div>
        {children}
    </div>
);

const GallerySettingsModal = () => {
    const { showSettings, setShowSettings, settings, setSettings } = useGalleryContext();
    // Staged (unsaved) settings
    const [staged, setStaged] = useSetState<SettingsState>(settings);
    const [extInput, setExtInput] = useState("");

    // When modal opens, reset staged to current settings
    useEffect(() => {
        if (showSettings) {
            setStaged(settings);
            setExtInput((settings && (settings as any).scanExtensions) ? (settings as any).scanExtensions.join(', ') : "");
        }
    }, [showSettings, settings, setStaged]);

    // Save staged settings to context and close
    const handleSave = () => {
        const exts = extInput.split(',').map(s => s.trim().replace(/^\./, '')).filter(s => s);
        const newSettings = { ...staged, scanExtensions: exts } as SettingsState;
        setSettings(newSettings);
        setShowSettings(false);
    };
    // Cancel: just close modal (staged will reset on next open)
    const handleCancel = () => {
        setShowSettings(false);
    };

    return (
        <Modal
            zIndex={BASE_Z_INDEX + 1}
            title={"Settings"}
            open={showSettings}
            centered
            width={560}
            afterOpenChange={setShowSettings}
            onOk={handleSave}
            onCancel={handleCancel}
            footer={(
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Button 
                        type="link" 
                        href="https://github.com/PanicTitan/ComfyUI-Gallery" 
                        target="_blank" 
                        icon={<GithubOutlined />}
                        style={{ paddingLeft: 0 }}
                    >
                        Leave a Star!
                    </Button>
                    <div>
                        <Button key="back" onClick={handleCancel}>Return</Button>
                        <Button key="submit" type="primary" onClick={handleSave} style={{ marginLeft: 8 }}>Save</Button>
                    </div>
                </div>
            )}
        >
            <Flex vertical gap={20} style={{ paddingTop: 8 }}>
                <Section title="Content">
                    <Row label="Folder to scan" hint="Folder inside the output directory shown in the gallery. './' = everything.">
                        <Input
                            style={{ width: 180 }}
                            value={staged.relativePath}
                            onChange={e => setStaged({ relativePath: e.target.value })}
                        />
                    </Row>
                    <Row label="File types" hint="Comma separated extensions to show (png, jpg, mp4, wav...).">
                        <Input style={{ width: 180 }} value={extInput} onChange={e => setExtInput(e.target.value)} />
                    </Row>
                </Section>

                <Section title="Open button">
                    <Row label="Button label" hint="Text shown on the topbar button.">
                        <Input
                            style={{ width: 180 }}
                            value={staged.buttonLabel}
                            onChange={e => setStaged({ buttonLabel: e.target.value })}
                        />
                    </Row>
                    <Row label="Floating button" hint="Off: the button stays in the top bar. On: a draggable floating button anywhere on screen.">
                        <Switch
                            checked={staged.floatingButton}
                            onChange={checked => setStaged({ floatingButton: checked })}
                        />
                    </Row>
                    <Row label="Hide button" hint="Hide the open button completely — open with Ctrl+G instead.">
                        <Switch
                            checked={staged.hideOpenButton}
                            onChange={checked => setStaged({ hideOpenButton: checked })}
                        />
                    </Row>
                    <Row label="Ctrl+G shortcut" hint="Open/close the gallery with the keyboard.">
                        <Switch
                            checked={staged.galleryShortcut}
                            onChange={checked => setStaged({ galleryShortcut: checked })}
                        />
                    </Row>
                </Section>

                <Section title="Display">
                    <Row label="Dark mode" hint="Dark theme for the gallery window.">
                        <Switch
                            checked={staged.darkMode}
                            onChange={checked => setStaged({ darkMode: checked })}
                        />
                    </Row>
                    <Row label="Date dividers" hint="Group files under a separator with the date.">
                        <Switch
                            checked={staged.showDateDivider}
                            onChange={checked => setStaged({ showDateDivider: checked })}
                        />
                    </Row>
                    <Row label="Autoplay videos" hint="Play video thumbnails automatically in the grid.">
                        <Switch
                            checked={staged.autoPlayVideos}
                            onChange={checked => setStaged({ autoPlayVideos: checked })}
                        />
                    </Row>
                    <Row label="Expand all folders" hint="Sidebar folders start expanded instead of collapsed.">
                        <Switch
                            checked={staged.expandAllFolders}
                            onChange={checked => setStaged({ expandAllFolders: checked })}
                        />
                    </Row>
                    <Row label="Image thumbnails" hint="How image thumbnails are sized in the grid.">
                        <Select
                            style={{ width: 180 }}
                            value={staged.imageThumbFit}
                            onChange={val => setStaged({ imageThumbFit: val })}
                            options={[
                                { value: 'width', label: 'Fit width' },
                                { value: 'height', label: 'Fit height' },
                            ]}
                        />
                    </Row>
                    <Row label="Video thumbnails" hint="How video thumbnails are sized in the grid.">
                        <Select
                            style={{ width: 180 }}
                            value={staged.videoThumbFit}
                            onChange={val => setStaged({ videoThumbFit: val })}
                            options={[
                                { value: 'width', label: 'Fit width' },
                                { value: 'height', label: 'Fit height' },
                            ]}
                        />
                    </Row>
                </Section>

                <Section title="Advanced">
                    <Row label="Button inject target" hint="CSS selector where the topbar button is injected. Touch only if the button doesn't appear after a ComfyUI frontend update.">
                        <Input
                            style={{ width: 180 }}
                            value={staged.buttonBoxQuery}
                            onChange={e => setStaged({ buttonBoxQuery: e.target.value })}
                        />
                    </Row>
                    <Row label="Polling file watcher" hint="Enable if new files don't appear in the gallery (e.g. network filesystems).">
                        <Switch
                            checked={staged.usePollingObserver}
                            onChange={checked => setStaged({ usePollingObserver: checked })}
                        />
                    </Row>
                    <Row label="Deduplicate symlinks" hint="Show files reachable via symlinked folders only once.">
                        <Switch
                            checked={staged.deduplicateSymlinks}
                            onChange={checked => setStaged({ deduplicateSymlinks: checked })}
                        />
                    </Row>
                    <Row label="Disable backend logs" hint="Silence the file watcher logs in the ComfyUI console.">
                        <Switch
                            checked={staged.disableLogs}
                            onChange={checked => setStaged({ disableLogs: checked })}
                        />
                    </Row>
                </Section>
            </Flex>
        </Modal>
    );
};

export default GallerySettingsModal;
