<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output indent="yes"/>
<xsl:strip-space elements="*"/>

<xsl:template name="menu">
	<div>
		<xsl:attribute name="class">context-menu
			<xsl:if test="./*[@hotkey]">hasHotkeys</xsl:if>
			<xsl:if test="@pointTo"><xsl:value-of select="@pointTo"/></xsl:if>
		</xsl:attribute><div class="cntnr">
		<xsl:for-each select="./*">
			<xsl:choose>
				<xsl:when test="@type='divider'"><div class="divider">&#160;</div></xsl:when>
				<xsl:otherwise>
					<div>
						<xsl:attribute name="data-id"><xsl:value-of select="@_id"/></xsl:attribute>
						<xsl:attribute name="class">LIVE menu-item
							<xsl:if test="count(./*) &gt; 0 or @invoke">hasSub</xsl:if>
							<xsl:if test="@checked = '1'">checked</xsl:if>
							<xsl:if test="@disabled">disabled</xsl:if>
						</xsl:attribute><xsl:value-of select="@name"/>
						<xsl:if test="@hotkey"><span><xsl:value-of select="@hotkey"/></span></xsl:if>
					</div>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
	</div></div>
</xsl:template>

<xsl:template name="assets">
	<xsl:for-each select=".//assets/*">
		<li>
			<xsl:attribute name="data-asset_id"><xsl:value-of select="@id"/></xsl:attribute>
			<figure>
				<xsl:attribute name="style">background-image: url(<xsl:value-of select="@source"/>);</xsl:attribute>
				&#160;</figure>
			<span><xsl:value-of select="@name"/></span>
		</li>
	</xsl:for-each>
</xsl:template>

<xsl:template name="timeline_left">
	<xsl:for-each select=".//timeline/layer">
		<xsl:sort order="ascending" select="@index"/>
		<li data-context="tl_track">
			<xsl:attribute name="data-track_id">track_<xsl:value-of select="@id"/></xsl:attribute>
			<xsl:if test="@hidden = 1"><xsl:attribute name="class">is_hidden</xsl:attribute></xsl:if>
			<figure data-cmd="timeline -s toggle_visible">
				<xsl:attribute name="class"><xsl:choose>
					<xsl:when test="@hidden = 1">icon-eye_off</xsl:when>
					<xsl:otherwise>icon-eye_on</xsl:otherwise>
				</xsl:choose></xsl:attribute>
				&#160;</figure>
			<figure class="icon-trashcan right" data-cmd="timeline -s delete_track">&#160;</figure>
			<figure class="icon-add right" data-cmd="timeline -s add_track">&#160;</figure>
			<figure class="icon-arrow_down" data-cmd="timeline -s toggle_layer">&#160;</figure>
			<span class="layer_name"><xsl:value-of select="//file/assets/*[@id=current()/@asset_id]/@name"/></span>
		</li>

		<li style="height: 0px; border: 0px;">
			<ul class="brushes">
			<xsl:for-each select="./brush">
				<li data-context="tl_anim_track">
					<xsl:attribute name="data-track_id">track_<xsl:value-of select="@id"/></xsl:attribute>
					<xsl:if test="@hidden = 1 or ../@hidden = 1"><xsl:attribute name="class">is_hidden</xsl:attribute></xsl:if>
					<figure data-cmd="timeline -s toggle_visible">
						<xsl:attribute name="class"><xsl:choose>
							<xsl:when test="@hidden = 1 or ../@hidden = 1">icon-eye_off</xsl:when>
							<xsl:otherwise>icon-eye_on</xsl:otherwise>
						</xsl:choose></xsl:attribute>
						&#160;</figure>
					<figure class="icon-trashcan right" data-cmd="timeline -s delete_track">&#160;</figure>
					<span><xsl:value-of select="@name"/></span>
				</li>
			</xsl:for-each>
			</ul>
		</li>
	</xsl:for-each>
</xsl:template>

<xsl:template name="timeline_right">
	<xsl:for-each select=".//timeline/layer">
		<xsl:sort order="ascending" select="@index"/>

		<li data-cmd="timeline -s make_track_active" data-context="tl_track">
			<xsl:attribute name="data-track_id">track_<xsl:value-of select="@id"/></xsl:attribute>
			<xsl:if test="@hidden = 1"><xsl:attribute name="class">is_hidden</xsl:attribute></xsl:if>
			<div>
				<xsl:attribute name="class">track_parent</xsl:attribute>
				<xsl:attribute name="style">
					margin-left: <xsl:value-of select="@start * 16"/>px;
					width: <xsl:value-of select="(@length * 16)-1"/>px;
				</xsl:attribute>
				&#160;
			</div>
		</li>
		
		<li style="height: 0px; border: 0px;">
			<ul class="brush_tracks">
			<xsl:for-each select="./brush">
				<li data-context="tl_anim_track">
					<xsl:attribute name="data-track_id">track_<xsl:value-of select="@id"/></xsl:attribute>
					<xsl:if test="@hidden = 1 or ../@hidden = 1"><xsl:attribute name="class">is_hidden</xsl:attribute></xsl:if>
					
					<xsl:for-each select="./i">
					<div>
						<xsl:attribute name="class">
							anim_track color_<xsl:value-of select="../@color"/>
						</xsl:attribute>
						<xsl:attribute name="style">
							left: <xsl:value-of select="(@start + ../../@start)*16"/>px;
							width: <xsl:value-of select="(@length * 16)-1"/>px;
						</xsl:attribute>
						&#160;
					</div>
					</xsl:for-each>

				</li>
			</xsl:for-each>
			</ul>
		</li>

	</xsl:for-each>
</xsl:template>
<!--
<xsl:template name="timeline_right2">
	<xsl:for-each select=".//timeline/layer">
		<xsl:sort order="ascending" select="@index"/>
		<li data-track="parent" data-cmd="timeline -s make_track_active" data-context="tl_track">

			<div>
				<xsl:attribute name="data-track_id">track_<xsl:value-of select="@id"/></xsl:attribute>
				<xsl:attribute name="class">
					track_parent <xsl:if test="@hidden = 1">is_hidden</xsl:if>
				</xsl:attribute>
				<xsl:attribute name="style">
					margin-left: <xsl:value-of select="@start * 16"/>px;
					width: <xsl:value-of select="(@length * 16)-1"/>px;
				</xsl:attribute>
				&#160;
			</div>

			<ul class="brush_tracks">
				<xsl:for-each select="./brush">
				<li data-context="tl_anim_track">
					<xsl:attribute name="data-track_id">brush_<xsl:value-of select="@id"/></xsl:attribute>
					<div>
						<xsl:attribute name="class">
							anim_track color_<xsl:value-of select="@color"/>
							<xsl:if test="@hidden = 1">is_hidden</xsl:if>
						</xsl:attribute>
						<xsl:attribute name="style">
							margin-left: <xsl:value-of select="(@start + ../@start)*16"/>px;
							width: <xsl:value-of select="(@length * 16)-1"/>px;
						</xsl:attribute>
						&#160;
					</div>
				</li>
				</xsl:for-each>
			</ul>

		</li>
	</xsl:for-each>
</xsl:template>
-->
</xsl:stylesheet>

