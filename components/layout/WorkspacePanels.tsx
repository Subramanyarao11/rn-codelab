'use client'

import { Panel, PanelGroup } from 'react-resizable-panels'
import { PanelFrame } from './PanelFrame'
import { ResizeHandle } from './ResizeHandle'

interface WorkspacePanelsProps {
  problemPanel: React.ReactNode
  editorPanel: React.ReactNode
  editorActions?: React.ReactNode
  previewPanel: React.ReactNode
  previewActions: React.ReactNode
  testPanel: React.ReactNode
}

export function WorkspacePanels({
  problemPanel,
  editorPanel,
  editorActions,
  previewPanel,
  previewActions,
  testPanel,
}: WorkspacePanelsProps) {
  return (
    <div className="h-full min-h-0 w-full">
      <PanelGroup
        direction="horizontal"
        autoSaveId="rn-labs-main-columns"
        className="h-full min-h-0"
      >
        {/* Left column: problem + editor */}
        <Panel defaultSize={52} minSize={28} maxSize={75}>
          <PanelGroup
            direction="vertical"
            autoSaveId="rn-labs-left-rows"
            className="h-full"
          >
            <Panel defaultSize={38} minSize={15} maxSize={65}>
              <PanelFrame label="Problem">{problemPanel}</PanelFrame>
            </Panel>
            <ResizeHandle direction="vertical" />
            <Panel defaultSize={62} minSize={25}>
              <PanelFrame label="Editor" actions={editorActions}>
                {editorPanel}
              </PanelFrame>
            </Panel>
          </PanelGroup>
        </Panel>

        <ResizeHandle direction="horizontal" />

        {/* Right column: preview + tests */}
        <Panel defaultSize={48} minSize={25} maxSize={72}>
          <PanelGroup
            direction="vertical"
            autoSaveId="rn-labs-right-rows"
            className="h-full"
          >
            <Panel defaultSize={58} minSize={20} maxSize={80}>
              <PanelFrame label="Preview" actions={previewActions}>
                {previewPanel}
              </PanelFrame>
            </Panel>
            <ResizeHandle direction="vertical" />
            <Panel defaultSize={42} minSize={18} maxSize={70}>
              <PanelFrame label="Tests">{testPanel}</PanelFrame>
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  )
}
