#!/bin/bash
#
# OpenClaw (MoltBot/ClawdBot) 部署与管理脚本
# 提取自 kejilion/sh (https://github.com/kejilion/sh)
#

# --- 颜色定义 ---
gl_hui='\e[37m'
gl_hong='\033[31m'
gl_lv='\033[32m'
gl_huang='\033[33m'
gl_lan='\033[34m'
gl_bai='\033[0m'
gl_zi='\033[35m'
gl_kjlan='\033[96m'
gl_qing='\033[36m'

# --- 辅助函数 ---

send_stats() {
    : # 统计上报（空实现）
}

break_end() {
    read -rp "按任意键继续..." _key
}

install() {
    for pkg in "$@"; do
        if command -v "$pkg" &>/dev/null; then
            echo "$pkg 已安装"
        else
            echo "正在安装 $pkg..."
            if command -v apt-get &>/dev/null; then
                apt-get install -y "$pkg"
            elif command -v dnf &>/dev/null; then
                dnf install -y "$pkg"
            elif command -v yum &>/dev/null; then
                yum install -y "$pkg"
            else
                echo "未知的包管理器，请手动安装 $pkg"; exit 1
            fi
        fi
    done
}

remove() {
    for pkg in "$@"; do
        if command -v apt-get &>/dev/null; then
            apt-get remove -y "$pkg"
        elif command -v dnf &>/dev/null; then
            dnf remove -y "$pkg"
        elif command -v yum &>/dev/null; then
            yum remove -y "$pkg"
        fi
    done
}

# 域名反向代理（需要自行配置 Nginx/Caddy）
add_yuming() {
    echo -e "${gl_huang}请在您的 Web 服务器（Nginx/Caddy）中手动配置反向代理到 http://127.0.0.1:3000${gl_bai}"
}

# --- 主菜单函数 ---

moltbot_menu() {
	local app_id="114"

	send_stats "clawdbot/moltbot管理"

	check_openclaw_update() {
		if ! command -v npm >/dev/null 2>&1; then
			return 1
		fi

		# 加上 --no-update-notifier，并确保错误重定向位置正确
		local_version=$(npm list -g openclaw --depth=0 --no-update-notifier 2>/dev/null | grep openclaw | awk '{print $NF}' | sed 's/^.*@//')

		if [ -z "$local_version" ]; then
			return 1
		fi

		remote_version=$(npm view openclaw version --no-update-notifier 2>/dev/null)

		if [ -z "$remote_version" ]; then
			return 1
		fi

		if [ "$local_version" != "$remote_version" ]; then
			echo "${gl_huang}检测到新版本:$remote_version${gl_bai}"
		else
			echo "${gl_lv}当前版本已是最新:$local_version${gl_bai}"
		fi
	}


	get_install_status() {
		if command -v openclaw >/dev/null 2>&1; then
			echo "${gl_lv}已安装${gl_bai}"
		else
			echo "${gl_hui}未安装${gl_bai}"
		fi
	}

	get_running_status() {
		if pgrep -f "openclaw-gatewa" >/dev/null 2>&1; then
			echo "${gl_lv}运行中${gl_bai}"
		else
			echo "${gl_hui}未运行${gl_bai}"
		fi
	}


	show_menu() {


		clear

		local install_status=$(get_install_status)
		local running_status=$(get_running_status)
		local update_message=$(check_openclaw_update)

		echo "======================================="
		echo -e "ClawdBot > MoltBot > OpenClaw 管理"
		echo -e "$install_status $running_status $update_message"
		echo "======================================="
		echo "1.  安装"
		echo "2.  启动"
		echo "3.  停止"
		echo "--------------------"
		echo "4.  状态日志查看"
		echo "5.  换模型"
		echo "6.  加新模型API"
		echo "7.  机器人连接对接"
		echo "8.  安装插件（如：飞书）"
		echo "9.  安装技能（skills）"
		echo "10. 编辑主配置文件"
		echo "11. 配置向导"
		echo "12. 健康检测与修复"
		echo "13. WebUI访问与设置"
		echo "14. TUI命令行对话窗口"
		echo "--------------------"
		echo "15. 更新"
		echo "16. 卸载"
		echo "--------------------"
		echo "0. 返回上一级选单"
		echo "--------------------"
		printf "请输入选项并回车: "
	}


	start_gateway() {
		openclaw gateway stop
		openclaw gateway start
		sleep 3
	}


	install_node_and_tools() {
		echo -e "${gl_huang}正在安装/检查依赖环境（git、Node.js 24）...${gl_bai}"

		# ---------- 安装 git ----------
		if ! command -v git &>/dev/null; then
			echo "正在安装 git..."
			if command -v apt-get &>/dev/null; then
				apt-get update -y && apt-get install -y git
			elif command -v dnf &>/dev/null; then
				dnf install -y git
			elif command -v yum &>/dev/null; then
				yum install -y git
			fi
		else
			echo -e "${gl_lv}git 已安装: $(git --version)${gl_bai}"
		fi

		# ---------- 安装 Node.js 24 ----------
		local node_ver=0
		if command -v node &>/dev/null; then
			node_ver=$(node --version 2>/dev/null | sed 's/v//' | cut -d. -f1)
		fi

		if [ "$node_ver" -lt 22 ] 2>/dev/null; then
			echo "正在安装 Node.js 24 LTS..."
			if command -v apt-get &>/dev/null; then
				curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
				apt-get install -y nodejs build-essential python3 libatomic1
			elif command -v dnf &>/dev/null; then
				curl -fsSL https://rpm.nodesource.com/setup_24.x | bash -
				dnf install -y nodejs cmake libatomic
			elif command -v yum &>/dev/null; then
				curl -fsSL https://rpm.nodesource.com/setup_24.x | bash -
				yum install -y nodejs cmake libatomic
			fi
		else
			echo -e "${gl_lv}Node.js 已满足要求: $(node --version)${gl_bai}"
		fi

		echo -e "${gl_lv}依赖检查完成 ✅${gl_bai}"
	}

	install_moltbot() {
		echo "开始安装 OpenClaw..."
		send_stats "开始安装 OpenClaw..."

		install_node_and_tools

		country=$(curl -s ipinfo.io/country)
		if [[ "$country" == "CN" || "$country" == "HK" ]]; then
			npm config set registry https://registry.npmmirror.com
		fi

		git config --global --unset url."git@github.com:".insteadOf 2>/dev/null || true

		echo "正在通过 npm 安装 openclaw（跳过原生模块编译）..."
		npm install -g openclaw@latest --ignore-scripts

		# 验证安装
		if ! command -v openclaw &>/dev/null; then
			# 尝试创建包装脚本
			local BASE_DIR
			BASE_DIR=$(npm root -g)/openclaw
			if [ -f "$BASE_DIR/dist/entry.js" ]; then
				cat > /usr/local/bin/openclaw << 'WRAPPER'
#!/bin/bash
exec node "$(npm root -g)/openclaw/dist/entry.js" "$@"
WRAPPER
				chmod +x /usr/local/bin/openclaw
				echo -e "${gl_lv}openclaw 包装脚本创建成功${gl_bai}"
			fi
		fi

		openclaw onboard --install-daemon
		start_gateway
		break_end

	}


	start_bot() {
		echo "启动 OpenClaw..."
		send_stats "启动 OpenClaw..."
		start_gateway
		break_end
	}

	stop_bot() {
		echo "停止 OpenClaw..."
		send_stats "停止 OpenClaw..."
		tmux kill-session -t gateway > /dev/null 2>&1
		openclaw gateway stop
		break_end
	}

	view_logs() {
		echo "查看 OpenClaw 状态日志"
		send_stats "查看 OpenClaw 日志"
		openclaw status
		openclaw gateway status
		openclaw logs
		break_end
	}





	# 核心函数：获取并添加所有模型
	add-all-models-from-provider() {
		local provider_name="$1"
		local base_url="$2"
		local api_key="$3"
		local config_file="${HOME}/.openclaw/openclaw.json"

		echo "🔍 正在获取 $provider_name 的所有可用模型..."

		# 获取模型列表
		local models_json=$(curl -s -m 10 \
			-H "Authorization: Bearer $api_key" \
			"${base_url}/models")

		if [[ -z "$models_json" ]]; then
			echo "❌ 无法获取模型列表"
			return 1
		fi

		# 提取所有模型ID
		local model_ids=$(echo "$models_json" | grep -oP '"id":\s*"\K[^"]+')

		if [[ -z "$model_ids" ]]; then
			echo "❌ 未找到任何模型"
			return 1
		fi

		local model_count=$(echo "$model_ids" | wc -l)
		echo "✅ 发现 $model_count 个模型"

		# 智能推断模型参数
		local models_array="["
		local first=true

		while read -r model_id; do
			[[ $first == false ]] && models_array+=","
			first=false

			# context 和 max_tokens 全拉满，不怕大
			local context_window=1048576
			local max_tokens=128000

			# 只有价格需要分级
			local input_cost=0.15
			local output_cost=0.60

			case "$model_id" in
				*opus*|*pro*|*preview*|*thinking*|*sonnet*)
					input_cost=2.00
					output_cost=12.00
					;;
				*gpt-5*|*codex*)
					input_cost=1.25
					output_cost=10.00
					;;
				*flash*|*lite*|*haiku*|*mini*|*nano*)
					input_cost=0.10
					output_cost=0.40
					;;
			esac

			models_array+=$(cat <<-EOF
{
	"id": "$model_id",
	"name": "$provider_name / $model_id",
	"input": ["text", "image"],
	"contextWindow": $context_window,
	"maxTokens": $max_tokens,
	"cost": {
		"input": $input_cost,
		"output": $output_cost,
		"cacheRead": 0,
		"cacheWrite": 0
	}
}
EOF
)
		done <<< "$model_ids"

		models_array+="]"

		# 备份配置
		[[ -f "$config_file" ]] && cp "$config_file" "${config_file}.bak.$(date +%s)"

		# 使用jq注入所有模型
		jq --arg prov "$provider_name" \
		   --arg url "$base_url" \
		   --arg key "$api_key" \
		   --argjson models "$models_array" \
		'
		.models |= (
			(. // { mode: "merge", providers: {} })
			| .mode = "merge"
			| .providers[$prov] = {
				baseUrl: $url,
				apiKey: $key,
				api: "openai-completions",
				models: $models
			}
		)
		' "$config_file" > "${config_file}.tmp" && mv "${config_file}.tmp" "$config_file"

		if [[ $? -eq 0 ]]; then
			echo "✅ 成功添加 $model_count 个模型到 $provider_name"
			echo "📦 模型引用格式: $provider_name/<model-id>"
			return 0
		else
			echo "❌ 配置注入失败"
			return 1
		fi
	}

	add-openclaw-provider-interactive() {
		send_stats "添加API"
		echo "=== 交互式添加 OpenClaw Provider (全量模型) ==="

		# 1. Provider 名称
		read -erp "请输入 Provider 名称 (如: deepseek): " provider_name
		while [[ -z "$provider_name" ]]; do
			echo "❌ Provider 名称不能为空"
			read -erp "请输入 Provider 名称: " provider_name
		done

		# 2. Base URL
		read -erp "请输入 Base URL (如: https://api.xxx.com/v1): " base_url
		while [[ -z "$base_url" ]]; do
			echo "❌ Base URL 不能为空"
			read -erp "请输入 Base URL: " base_url
		done
		base_url="${base_url%/}"

		# 3. API Key
		read -rsp "请输入 API Key (输入不显示): " api_key
		echo
		while [[ -z "$api_key" ]]; do
			echo "❌ API Key 不能为空"
			read -rsp "请输入 API Key: " api_key
			echo
		done

		# 4. 获取模型列表
		echo "🔍 正在获取可用模型列表..."
		models_json=$(curl -s -m 10 \
			-H "Authorization: Bearer $api_key" \
			"${base_url}/models")

		if [[ -n "$models_json" ]]; then
			available_models=$(echo "$models_json" | grep -oP '"id":\s*"\K[^"]+' | sort)

			if [[ -n "$available_models" ]]; then
				model_count=$(echo "$available_models" | wc -l)
				echo "✅ 发现 $model_count 个可用模型："
				echo "--------------------------------"
				# 全部显示，带序号
				i=1
				declare -A model_map
				while read -r model; do
					echo "[$i] $model"
					model_map[$i]="$model"
					((i++))
				done <<< "$available_models"
				echo "--------------------------------"
			fi
		fi

		# 5. 选择默认模型
		echo
		read -erp "请输入默认 Model ID (或序号，留空则使用第一个): " input_model

		if [[ -z "$input_model" && -n "$available_models" ]]; then
			default_model=$(echo "$available_models" | head -1)
			echo "🎯 使用第一个模型: $default_model"
		elif [[ -n "${model_map[$input_model]}" ]]; then
			default_model="${model_map[$input_model]}"
			echo "🎯 已选择模型: $default_model"
		else
			default_model="$input_model"
		fi

		# 6. 确认信息
		echo
		echo "====== 确认信息 ======"
		echo "Provider    : $provider_name"
		echo "Base URL    : $base_url"
		echo "API Key     : ${api_key:0:8}****"
		echo "默认模型    : $default_model"
		echo "模型总数    : $model_count"
		echo "======================"

		read -erp "确认添加所有 $model_count 个模型？(y/N): " confirm
		if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
			echo "❎ 已取消"
			return 1
		fi

		install jq
		add-all-models-from-provider "$provider_name" "$base_url" "$api_key"

		if [[ $? -eq 0 ]]; then
			echo
			echo "🔄 设置默认模型并重启网关..."
			openclaw models set "$provider_name/$default_model"
			start_gateway
			echo "✅ 完成！所有 $model_count 个模型已加载"
		fi

		break_end
	}



	change_model() {
		send_stats "换模型"

		while true; do
			clear
			echo "--- 模型管理 ---"
			echo "所有模型:"
			openclaw models list --all
			echo "----------------"
			echo "当前模型:"
			openclaw models list
			echo "----------------"
			read -e -p "请输入要设置的模型名称 (例如 openrouter/openai/gpt-4o)（输入 0 退出）： " model

			# 1. 检查是否输入 0 以退出
			if [ "$model" = "0" ]; then
				echo "操作已取消，正在退出..."
				break  # 跳出 while 循环

			fi

			# 2. 验证输入是否为空
			if [ -z "$model" ]; then
				echo "错误：模型名称不能为空。请重试。"
				echo "" # 换行美化
				continue # 跳过本次循环，重新开始
			fi

			# 3. 执行切换逻辑
			echo "正在切换模型为: $model ..."
			openclaw models set "$model"

			break_end
		done

	}





	install_plugin() {
		send_stats "安装插件"
		while true; do
			clear
			echo "========================================"
			echo "            插件管理 (安装)            "
			echo "========================================"
			echo "当前插件列表:"
			openclaw plugins list
			echo "--------------------------------------------------------"
			echo "推荐的常用插件 ID (直接复制括号内的 ID 即可):"
			echo "--------------------------------------------------------"
			echo "📱 通讯渠道:"
			echo "  - [feishu]       	# 飞书/Lark 集成"
			echo "  - [telegram]     	# Telegram 机器人"
			echo "  - [slack]        	# Slack 企业通讯"
			echo "  - [msteams]      	# Microsoft Teams"
			echo "  - [discord]      	# Discord 社区管理"
			echo "  - [whatsapp]     	# WhatsApp 自动化"
			echo ""
			echo "🧠 记忆与 AI:"
			echo "  - [memory-core]  	# 基础记忆 (文件检索)"
			echo "  - [memory-lancedb]	# 增强记忆 (向量数据库)"
			echo "  - [copilot-proxy]	# Copilot 接口转发"
			echo ""
			echo "⚙️ 功能扩展:"
			echo "  - [lobster]      	# 审批流 (带人工确认)"
			echo "  - [voice-call]   	# 语音通话能力"
			echo "  - [nostr]        	# 加密隐私聊天"
			echo "--------------------------------------------------------"

			read -e -p "请输入插件 ID（输入 0 退出）： " raw_input

			[ "$raw_input" = "0" ] && break
			[ -z "$raw_input" ] && continue

			# 1. 自动处理：如果用户输入带 @openclaw/，提取纯 ID 方便路径检查
			local plugin_id=$(echo "$raw_input" | sed 's|^@openclaw/||')
			local plugin_full="$raw_input"

			echo "🔍 正在检查插件状态..."

			# 2. 检查是否已经在 list 中且为 disabled (最常见的情况)
			if echo "$plugin_list" | grep -qw "$plugin_id" && echo "$plugin_list" | grep "$plugin_id" | grep -q "disabled"; then
				echo "💡 插件 [$plugin_id] 已预装，正在激活..."
				openclaw plugins enable "$plugin_id" && echo "✅ 激活成功" || echo "❌ 激活失败"

			# 3. 检查系统物理目录是否存在
			elif [ -d "/usr/lib/node_modules/openclaw/extensions/$plugin_id" ]; then
				echo "💡 发现系统内置目录存在该插件，尝试直接启用..."
				openclaw plugins enable "$plugin_id"

			else
				# 4. 远程安装逻辑
				echo "📥 本地未发现，尝试下载安装..."

				# 清理旧的失败残留
				rm -rf "/root/.openclaw/extensions/$plugin_id"

				# 执行安装，并捕获结果
				if openclaw plugins install "$plugin_full"; then
					echo "✅ 下载成功，正在启用..."
					openclaw plugins enable "$plugin_id"
				else
					echo "⚠️ 官方渠道下载失败，尝试备选方案..."
					# 备选 npm 安装
					if npm install -g "$plugin_full" --unsafe-perm; then
						echo "✅ npm 安装成功，尝试启用..."
						openclaw plugins enable "$plugin_id"
					else
						echo "❌ 严重错误：无法获取该插件。请检查 ID 是否正确或网络是否可用。"
						# 关键：这里直接 return 或 continue，不走下面的 start_gateway，防止写死配置
						break_end
						continue
					fi
				fi
			fi

			echo "🔄 正在重启 OpenClaw 服务以加载新插件..."
			start_gateway
			break_end
		done
	}







	install_skill() {
		send_stats "安装技能"
		while true; do
			clear
			echo "========================================"
			echo "            技能管理 (安装)            "
			echo "========================================"
			echo "当前已安装技能:"
			openclaw skills list
			echo "----------------------------------------"

			# 输出推荐的实用技能列表
			echo "推荐的实用技能（可直接复制名称输入）："
			echo "github             # 管理 GitHub Issues/PR/CI (gh CLI)"
			echo "notion             # 操作 Notion 页面、数据库和块"
			echo "apple-notes        # macOS 原生笔记管理 (创建/编辑/搜索)"
			echo "apple-reminders    # macOS 提醒事项管理 (待办清单)"
			echo "1password          # 自动化读取和注入 1Password 密钥"
			echo "gog                # Google Workspace (Gmail/云盘/文档) 全能助手"
			echo "things-mac         # 深度整合 Things 3 任务管理"
			echo "bluebubbles        # 通过 BlueBubbles 完美收发 iMessage"
			echo "himalaya           # 终端邮件管理 (IMAP/SMTP 强力工具)"
			echo "summarize          # 网页/播客/YouTube 视频内容一键总结"
			echo "openhue            # 控制 Philips Hue 智能灯光场景"
			echo "video-frames       # 视频抽帧与短片剪辑 (ffmpeg 驱动)"
			echo "openai-whisper     # 本地音频转文字 (离线隐私保护)"
			echo "coding-agent       # 自动运行 Claude Code/Codex 等编程助手"
			echo "----------------------------------------"

			# 提示用户输入技能名称
			read -e -p "请输入要安装的技能名称（输入 0 退出）： " skill_name

			# 1. 检查是否输入 0 以退出
			if [ "$skill_name" = "0" ]; then
				echo "操作已取消，退出技能安装。"
				break
			fi

			# 2. 验证输入是否为空
			if [ -z "$skill_name" ]; then
				echo "错误：技能名称不能为空。请重试。"
				echo ""
				continue
			fi

			# 3. 执行安装命令
			echo "正在安装技能：$skill_name ..."
			npx clawhub install "$skill_name"

			# 获取上一条命令的退出状态
			if [ $? -eq 0 ]; then
				echo "✅ 技能 $skill_name 安装成功。"
				# 执行重启/启动服务逻辑
				start_gateway
			else
				echo "❌ 安装失败。请检查技能名称是否正确，或参考文档排查。"
			fi

			break_end
		done

	}



	change_tg_bot_code() {
		send_stats "机器人对接"
		while true; do
			clear
			echo "========================================"
			echo "            机器人连接对接            "
			echo "========================================"
			echo "1. Telegram 机器人对接"
			echo "2. 飞书 (Lark) 机器人对接"
			echo "3. WhatsApp 机器人对接"
			echo "----------------------------------------"
			echo "0. 返回上一级选单"
			echo "----------------------------------------"
			read -e -p "请输入你的选择: " bot_choice

			case $bot_choice in
				1)
					read -e -p "请输入TG机器人收到的连接码 (例如 NYA99R2F)（输入 0 退出）： " code
					if [ "$code" = "0" ]; then continue; fi
					if [ -z "$code" ]; then echo "错误：连接码不能为空。"; sleep 1; continue; fi
					openclaw pairing approve telegram "$code"
					break_end
					;;
				2)
					read -e -p "请输入飞书机器人收到的连接码 (例如 NYA99R2F)（输入 0 退出）： " code
					if [ "$code" = "0" ]; then continue; fi
					if [ -z "$code" ]; then echo "错误：连接码不能为空。"; sleep 1; continue; fi
					openclaw pairing approve feishu "$code"
					break_end
					;;
				3)
					read -e -p "请输入WhatsApp收到的连接码 (例如 NYA99R2F)（输入 0 退出）： " code
					if [ "$code" = "0" ]; then continue; fi
					if [ -z "$code" ]; then echo "错误：连接码不能为空。"; sleep 1; continue; fi
					openclaw pairing approve whatsapp "$code"
					break_end
					;;
				0)
					return 0
					;;
				*)
					echo "无效的选择，请重试。"
					sleep 1
					;;
			esac
		done
	}


	update_moltbot() {
		echo "更新 OpenClaw..."
		send_stats "更新 OpenClaw..."
		install_node_and_tools
		npm install -g openclaw@latest
		crontab -l 2>/dev/null | grep -v "s gateway" | crontab -
		start_gateway
		hash -r
		add_app_id
		echo "更新完成"
		break_end
	}


	uninstall_moltbot() {
		echo "卸载 OpenClaw..."
		send_stats "卸载 OpenClaw..."
		openclaw uninstall
		npm uninstall -g openclaw
		crontab -l 2>/dev/null | grep -v "s gateway" | crontab -
		rm -rf /root/.openclaw
		hash -r
		sed -i "/\b${app_id}\b/d" /home/docker/appno.txt
		echo "卸载完成"
		break_end
	}

	nano_openclaw_json() {
		send_stats "编辑 OpenClaw 配置文件"
		install nano
		nano ~/.openclaw/openclaw.json
		start_gateway
	}






	openclaw_find_webui_domain() {
		local conf domain_list

		domain_list=$(
			grep -R "18789" /home/web/conf.d/*.conf 2>/dev/null \
			| awk -F: '{print $1}' \
			| sort -u \
			| while read conf; do
				basename "$conf" .conf
			done
		)

		if [ -n "$domain_list" ]; then
			echo "$domain_list"
		fi
	}



	openclaw_show_webui_addr() {
		local local_ip token domains

		echo "=================================="
		echo "OpenClaw WebUI 访问地址"
		local_ip="127.0.0.1"

		token=$(
			openclaw dashboard 2>/dev/null \
			| sed -n 's/.*:18789\/#token=\([a-f0-9]\+\).*/\1/p' \
			| head -n 1
		)
		echo
		echo "本机地址："
		echo "http://${local_ip}:18789/#token=${token}"

		domains=$(openclaw_find_webui_domain)
		if [ -n "$domains" ]; then
			echo "域名地址："
			echo "$domains" | while read d; do
				echo "https://${d}/#token=${token}"
			done
		fi

		echo "=================================="
	}



	# 添加域名（调用你给的函数）
	openclaw_domain_webui() {
		add_yuming
		ldnmp_Proxy ${yuming} 127.0.0.1 18789

		token=$(
			openclaw dashboard 2>/dev/null \
			| sed -n 's/.*:18789\/#token=\([a-f0-9]\+\).*/\1/p' \
			| head -n 1
		)

		clear
		echo "访问地址:"
		echo "https://${yuming}/#token=$token"
		echo "先访问URL触发设备ID，然后回车下一步进行配对。"
		read
		echo -e "${gl_kjlan}正在加载设备列表……${gl_bai}"
		# 自动添加域名到 allowedOrigins
		config_file="$HOME/.openclaw/openclaw.json"
		if [ -f "$config_file" ]; then
			new_origin="https://${yuming}"
			# 使用 jq 安全修改 JSON，确保结构存在且不重复添加域名
			if command -v jq >/dev/null 2>&1; then
				tmp_json=$(mktemp)
				jq 'if .gateway.controlUi == null then .gateway.controlUi = {"allowedOrigins": ["http://127.0.0.1"]} else . end | if (.gateway.controlUi.allowedOrigins | contains([$origin]) | not) then .gateway.controlUi.allowedOrigins += [$origin] else . end' --arg origin "$new_origin" "$config_file" > "$tmp_json" && mv "$tmp_json" "$config_file"
				echo -e "${gl_kjlan}已将域名 ${yuming} 加入 allowedOrigins 配置${gl_bai}"
				openclaw gateway restart >/dev/null 2>&1
			fi
		fi

		openclaw devices list

		read -e -p "请输入 Request_Key: " Request_Key

		[ -z "$Request_Key" ] && {
			echo "Request_Key 不能为空"
			return 1
		}

		openclaw devices approve "$Request_Key"

	}

	# 删除域名
	openclaw_remove_domain() {
		echo "域名格式 example.com 不带https://"
		web_del
	}

	# 主菜单
	openclaw_webui_menu() {

		send_stats "WebUI访问与设置"
		while true; do
			clear
			openclaw_show_webui_addr
			echo
			echo "1. 添加域名访问"
			echo "2. 删除域名访问"
			echo "0. 退出"
			echo
			read -e -p "请选择: " choice

			case "$choice" in
				1)
					openclaw_domain_webui
					echo
					read -p "按回车返回菜单..."
					;;
				2)
					openclaw_remove_domain
					read -p "按回车返回菜单..."
					;;
				0)
					break
					;;
				*)
					echo "无效选项"
					sleep 1
					;;
			esac
		done
	}



	# 主循环
	while true; do
		show_menu
		read choice
		case $choice in
			1) install_moltbot ;;
			2) start_bot ;;
			3) stop_bot ;;
			4) view_logs ;;
			5) change_model ;;
			6) add-openclaw-provider-interactive ;;
			7) change_tg_bot_code ;;
			8) install_plugin ;;
			9) install_skill ;;
			10) nano_openclaw_json ;;
			11) send_stats "初始化配置向导"
				openclaw onboard --install-daemon
				break_end
				;;
			12) send_stats "健康检测与修复"
				openclaw doctor --fix
				break_end
			 	;;
			13) openclaw_webui_menu ;;
			14) send_stats "TUI命令行对话"
				openclaw tui
				break_end
			 	;;
			15) update_moltbot ;;
			16) uninstall_moltbot ;;
			*) break ;;
		esac
	done
}


# --- 入口 ---
moltbot_menu
