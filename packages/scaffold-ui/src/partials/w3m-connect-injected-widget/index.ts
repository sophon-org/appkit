import { LitElement, html } from 'lit'
import { property } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'

import type { Connector, ConnectorWithProviders } from '@reown/appkit-controllers'
import { AssetUtil, ConnectorController, RouterController } from '@reown/appkit-controllers'
import { customElement } from '@reown/appkit-ui'
import '@reown/appkit-ui/wui-flex'
import '@reown/appkit-ui/wui-list-wallet'

import { ConnectorUtil } from '../../utils/ConnectorUtil.js'

@customElement('w3m-connect-injected-widget')
export class W3mConnectInjectedWidget extends LitElement {
  // -- State & Properties -------------------------------- //  // -- State & Properties -------------------------------- //
  @property() public tabIdx?: number = undefined

  @property() public connectors: ConnectorWithProviders[] = []

  // -- Render -------------------------------------------- //
  public override render() {
    const injectedConnectors = this.connectors.filter(ConnectorUtil.showConnector)

    if (injectedConnectors.length === 0) {
      this.style.cssText = `display: none`

      return null
    }

    return html`
      <wui-flex flexDirection="column" gap="xs">
        ${injectedConnectors.map(
          connector => html`
            <wui-list-wallet
              imageSrc=${ifDefined(AssetUtil.getConnectorImage(connector))}
              .installed=${true}
              name=${connector.name ?? 'Unknown'}
              tagVariant="success"
              tagLabel="installed"
              data-testid=${`wallet-selector-${connector.id}`}
              @click=${() => this.onConnector(connector)}
              tabIdx=${ifDefined(this.tabIdx)}
            >
            </wui-list-wallet>
          `
        )}
      </wui-flex>
    `
  }

  // -- Private Methods ----------------------------------- //
  private onConnector(connector: Connector) {
    ConnectorController.setActiveConnector(connector)
    RouterController.push('ConnectingExternal', { connector })
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'w3m-connect-injected-widget': W3mConnectInjectedWidget
  }
}
