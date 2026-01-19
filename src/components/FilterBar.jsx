import React from 'react';
import { X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { BRANDS, FUEL_TYPES, getYears, PRICE_RANGES } from '../utils/constants';

export const FilterBar = ({ filters, onFilterChange, onClear }) => {
    const years = getYears(15);
    const hasFilters = filters.brand || filters.fuel_type || filters.min_year || filters.min_price;

    return (
        <div className="bg-[#F4F4F4] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-archivo font-bold text-lg text-[#1A1A1A] dark:text-white">Filtros</h3>
                {hasFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClear}
                        className="text-[#666666] hover:text-[#E60000]"
                        data-testid="clear-filters-btn"
                    >
                        <X size={16} className="mr-1" />
                        Limpar
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Marca */}
                <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                        Marca
                    </label>
                    <Select
                        value={filters.brand || ''}
                        onValueChange={(value) => onFilterChange('brand', value === 'all' ? '' : value)}
                    >
                        <SelectTrigger 
                            className="rounded-[2px] border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222]"
                            data-testid="filter-brand"
                        >
                            <SelectValue placeholder="Todas as marcas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas as marcas</SelectItem>
                            {BRANDS.map((brand) => (
                                <SelectItem key={brand} value={brand}>
                                    {brand}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Combustível */}
                <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                        Combustível
                    </label>
                    <Select
                        value={filters.fuel_type || ''}
                        onValueChange={(value) => onFilterChange('fuel_type', value === 'all' ? '' : value)}
                    >
                        <SelectTrigger 
                            className="rounded-[2px] border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222]"
                            data-testid="filter-fuel"
                        >
                            <SelectValue placeholder="Todos os tipos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os tipos</SelectItem>
                            {FUEL_TYPES.map((fuel) => (
                                <SelectItem key={fuel} value={fuel}>
                                    {fuel}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Ano */}
                <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                        Ano (desde)
                    </label>
                    <Select
                        value={filters.min_year?.toString() || ''}
                        onValueChange={(value) => onFilterChange('min_year', value === 'all' ? '' : parseInt(value))}
                    >
                        <SelectTrigger 
                            className="rounded-[2px] border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222]"
                            data-testid="filter-year"
                        >
                            <SelectValue placeholder="Qualquer ano" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Qualquer ano</SelectItem>
                            {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Preço */}
                <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                        Preço
                    </label>
                    <Select
                        value={filters.min_price?.toString() || ''}
                        onValueChange={(value) => {
                            if (value === 'all') {
                                onFilterChange('min_price', '');
                                onFilterChange('max_price', '');
                            } else {
                                const range = PRICE_RANGES.find(r => r.min.toString() === value);
                                if (range) {
                                    onFilterChange('min_price', range.min);
                                    onFilterChange('max_price', range.max);
                                }
                            }
                        }}
                    >
                        <SelectTrigger 
                            className="rounded-[2px] border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222]"
                            data-testid="filter-price"
                        >
                            <SelectValue placeholder="Qualquer preço" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Qualquer preço</SelectItem>
                            {PRICE_RANGES.map((range) => (
                                <SelectItem key={range.min} value={range.min.toString()}>
                                    {range.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};
